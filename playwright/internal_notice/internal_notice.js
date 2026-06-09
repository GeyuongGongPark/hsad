/**
 * 사내 공지사항 CRUD 시나리오 - Playwright용
 * 플로우: 목록 확인 → 작성 페이지 진입 → 제목 입력 → 저장 → 수정 → 취소 후 목록 복귀
 */
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../util/selector_hsad.js';
import { getFormattedTimestamp } from '../util/utils.js';
import { getCredentials, loginWithPage } from '../login/login_helper.js';

const {
    PAGE_TITLE,
    CANCEL_BUTTON,
    SAVE_BUTTON,
    EDIT_BUTTON,
    PAGE_TITLE_1,
    DELETE_BUTTON,
    PREVIEW_BUTTON,
    CANCEL_BUTTON_1,
    INPUT,
    PAGINATION,
} = SELECTORS.BUSINESS.INTERNAL_NOTICE;

/**
 * @param {import('@playwright/test').Page} page
 */
export async function run(page) {
    const credentials = getCredentials();
    const getNewTimestamp = () => getFormattedTimestamp().replace(/:/g, '_');

    await loginWithPage(page, credentials);

    // 1. 공지사항 목록 페이지 진입
    await page.goto(URLS.INTERNAL_NOTICE.LIST);
    await page.waitForSelector(PAGE_TITLE);
    let timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_list.png` });

    // 목록 페이지네이션 확인
    const pagination = page.locator(PAGINATION);
    if (await pagination.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_pagination.png` });
    }

    // 2. 공지사항 작성 페이지 진입
    await page.goto(URLS.INTERNAL_NOTICE.CREATE);
    await page.waitForSelector(INPUT);
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_create.png` });

    // 3. 제목 입력
    await page.locator(INPUT).fill(`테스트 공지사항 ${getNewTimestamp()}`);
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_input.png` });

    // 4. 저장 버튼 클릭 → 상세 페이지 이동 확인
    await page.locator(SAVE_BUTTON).click();
    await page.waitForSelector(PAGE_TITLE_1);
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_detail.png` });

    // 상세 페이지: 삭제 버튼 확인
    const deleteBtn = page.locator(DELETE_BUTTON);
    if (await deleteBtn.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_detail_with_delete.png` });
    }

    // 5. 수정 버튼 클릭
    await page.locator(EDIT_BUTTON).click();
    await page.waitForSelector(INPUT);
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_edit.png` });

    // 수정 페이지: 미리보기, 취소 버튼 확인
    await page.locator(PREVIEW_BUTTON).isVisible();
    await page.locator(CANCEL_BUTTON_1).isVisible();
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_edit_buttons.png` });

    // 6. 취소 버튼 클릭 → 목록 복귀
    await page.locator(CANCEL_BUTTON).click();
    await page.waitForSelector(PAGE_TITLE);
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_internal_notice_back_to_list.png` });
}
