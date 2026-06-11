/**
 * HSAD Playwright 공통 헬퍼 함수
 */
import { SELECTORS } from './selector_hsad.js';
import { wait } from './utils.js';

const CLM = SELECTORS.BUSINESS.CLM;

/**
 * 보안 여부, 검토 진행 여부, 계약 검토 요청 공통 처리
 * (clm_draft.new / change / stop 공통 사용)
 * @param {import('@playwright/test').Page} page
 * @param {string} timestamp
 */
export async function applySecurityAndReviewSettings(page, timestamp) {
    // 보안 여부
    if (process.env.SECURITY_TYPE === 'all') {
        await page.waitForSelector(CLM.SECURITY_ALL_LABEL, { state: 'visible', timeout: 5000 });
        await page.locator(CLM.SECURITY_ALL_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_all.png` });
    } else if (process.env.SECURITY_TYPE === 'refer') {
        await page.locator(CLM.SECURITY_REFER_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_refer.png` });
    } else {
        await page.locator(CLM.SECURITY_PRIVATE_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_hidden.png` });
    }

    // 검토 진행 여부
    if (process.env.REVIEW_TYPE === 'use') {
        await page.locator(CLM.REVIEW_NEEDED_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_review.png` });
    } else {
        await page.locator(CLM.REVIEW_NOT_NEEDED_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_noreview.png` });
    }

    // 계약 검토 요청
    if (process.env.APPROVAL_SET === 'use') {
        await page.locator(CLM.ADD_APPROVER_ICON).click();
    } else {
        await page.locator(CLM.CONTRACT_REVIEW_REQUEST_BTN).click();
        await page.screenshot({ path: `screenshots/${timestamp}_creat.png` });
        await clickFooterConfirm(page);
        await page.screenshot({ path: `screenshots/${timestamp}_assignees.png` });
        await page.waitForURL(/\/clm\/[^/]+\/draft/, { timeout: 15000 });
        await page.screenshot({ path: `screenshots/${timestamp}_new_contract.png` });
    }
}

/**
 * footer-safe-area 모달의 확인 버튼 클릭
 * @param {import('@playwright/test').Page} page
 */
export async function clickFooterConfirm(page) {
    await page.waitForSelector(CLM.FOOTER_CONFIRM_BUTTON);
    await page.locator(CLM.FOOTER_CONFIRM_BUTTON).click();
    await page.locator(CLM.FOOTER_CONFIRM_BUTTON).waitFor({ state: 'hidden', timeout: 10000 });
}

/**
 * My계약서에서 불러오기 플로우 공통 처리
 * @param {import('@playwright/test').Page} page
 * @param {string} timestamp
 */
export async function uploadContractFromLibrary(page, timestamp) {
    await page.waitForSelector(CLM.LOAD_ICON);
    await page.locator(CLM.LOAD_ICON).click();
    await page.screenshot({ path: `screenshots/${timestamp}_load.png` });

    try {
        await page.waitForSelector('img[src*="loading.gif"]', { state: 'hidden', timeout: 20000 });
    } catch (_) {
        console.warn('[helpers] loading.gif 숨김 대기 타임아웃 — 계속 진행');
        await page.screenshot({ path: `screenshots/${timestamp}_loading_timeout.png` });
    }

    await page.waitForSelector('//div[text()="문서 불러오기"]');
    await page.locator('(//img[@alt="파일"]/ancestor::div[contains(@class, "cursor-pointer")])[1]').click();
    await page.screenshot({ path: `screenshots/${timestamp}_contract.png` });

    await page.waitForSelector('//button[text()="선택"]', { state: 'visible', timeout: 5000 });
    await page.locator('//button[text()="선택"]').click();
    await page.screenshot({ path: `screenshots/${timestamp}_select.png` });

    try {
        await page.waitForSelector('img[src*="loading.gif"]', { state: 'hidden', timeout: 20000 });
    } catch (_) {
        // 로딩 이미지가 이미 사라졌거나 처음부터 없는 경우 — 무시하고 계속 진행
    }

    try {
        await page.waitForSelector('//div[text()="문서 불러오기"]', { state: 'hidden', timeout: 10000 });
    } catch (_) {
        // 팝업이 이미 닫혔거나 처음부터 없는 경우 — 무시하고 계속 진행
    }

    await wait(500);
}
