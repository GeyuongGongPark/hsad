/**
 * CLM 변경 계약 검토 요청 - Playwright용
 */
import { URLS } from '../../util/url_base_hsad.js';
import { SELECTORS } from '../../util/selector_hsad.js';
import { getFormattedTimestamp } from '../../util/utils.js';
import { getCredentials, loginWithPage } from '../../login/login_helper.js';
import { clickFooterConfirm, uploadContractFromLibrary, applySecurityAndReviewSettings } from '../../util/helpers.js';

const CLM = SELECTORS.BUSINESS.CLM;

/**
 * @param {import('@playwright/test').Page} page
 */
export async function run(page) {
    const credentials = getCredentials();
    const getNewTimestamp = () => getFormattedTimestamp().replace(/:/g, '_');

    await loginWithPage(page, credentials);

    // 임시 저장 리스트 호출
    await page.goto(URLS.CLM.DRAFT);
    let timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_clm.png` });

    // 신규 검토 요청 btn 클릭
    await page.waitForSelector(CLM.NEW_REVIEW_REQUEST_BUTTON);
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_before_request.png` });
    await page.locator(CLM.NEW_REVIEW_REQUEST_BUTTON).click();
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_after_request.png` });

    // 계약 검토 요청 모달 확인 btn 클릭
    await clickFooterConfirm(page);
    await page.waitForURL(/\/clm\/[^/]+\/draft/, { timeout: 15000 });
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_after_confirm.png` });

    // 계약 구분 : 변경
    await page.locator(CLM.DRAFT_TYPE_CHANGE_LABEL).click();
    await page.waitForSelector(CLM.RELATED_CONTRACT_SEARCH_BTN);
    await page.locator(CLM.RELATED_CONTRACT_SEARCH_BTN).click();
    await page.screenshot({ path: `screenshots/${timestamp}_related_contract_search.png` });
    await page.locator(CLM.FIRST_SELECT_BUTTON).click();
    await page.screenshot({ path: `screenshots/${timestamp}_related_contract_select.png` });

    // 편집기 사용 여부
    if (process.env.EDITOR_USE === 'use') {
        await page.locator(CLM.EDITOR_USE_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_editor_use.png` });
    } else {
        await page.locator(CLM.EDITOR_NOT_USE_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_editor_none.png` });
    }

    // 계약서 첨부 방식
    if (process.env.CONTRACT_TYPE === 'file') {
        await page.locator(CLM.ATTACH_BY_FILE_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_contract.png` });
    } else {
        await page.waitForSelector(CLM.ATTACH_FROM_MY_LABEL);
        await page.locator(CLM.ATTACH_FROM_MY_LABEL).click();
        await page.screenshot({ path: `screenshots/${timestamp}_my.png` });
    }

    // 계약서 선택
    if (process.env.CONTRACT_SELECT === 'file') {
        await page.locator(CLM.FILE_UPLOAD_ICON).click();
        await page.screenshot({ path: `screenshots/${timestamp}_file.png` });
    } else {
        await uploadContractFromLibrary(page, timestamp);

        await page.locator(CLM.CONTRACT_NAME_INPUT).fill(`신규 계약서_${timestamp}`);
        await page.screenshot({ path: `screenshots/${timestamp}_name.png` });

        await applySecurityAndReviewSettings(page, timestamp);
    }
}
