/**
 * 법률 서비스 (Legal Draft) 시나리오 - Playwright용
 * 플로우: 법률 서비스 진입 → 버튼 표시 확인 → 첨부 클릭 → 외부 열기 확인
 */
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../util/selector_hsad.js';
import { getFormattedTimestamp } from '../util/utils.js';
import { getCredentials, loginWithPage } from '../login/login_helper.js';

const {
    BUTTON,
    ATTACH,
    OPEN_EXTERNAL,
    ATTACH_1,
} = SELECTORS.BUSINESS.LEGAL_DRAFT;

/**
 * @param {import('@playwright/test').Page} page
 */
export async function run(page) {
    const credentials = getCredentials();
    const getNewTimestamp = () => getFormattedTimestamp().replace(/:/g, '_');

    await loginWithPage(page, credentials);

    // 1. 법률 서비스 페이지 진입
    await page.goto(URLS.LEGAL_DRAFT.LEGAL_DRAFT);
    await page.waitForSelector(BUTTON);
    let timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_legal_draft_list.png` });

    // 2. 버튼 표시 확인
    await page.locator(BUTTON).isVisible();
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_legal_draft_button_visible.png` });

    // 3. 첨부 버튼 클릭 → 파일 첨부 플로우 진입 확인
    const attachBtn = page.locator(ATTACH);
    if (await attachBtn.isVisible()) {
        await attachBtn.click();
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_legal_draft_attach_clicked.png` });

        // 추가 첨부 버튼 확인
        const attach1 = page.locator(ATTACH_1);
        if (await attach1.isVisible()) {
            timestamp = getNewTimestamp();
            await page.screenshot({ path: `screenshots/${timestamp}_legal_draft_attach1_visible.png` });
        }
    }

    // 4. 외부 열기 버튼 확인
    const openExternalBtn = page.locator(OPEN_EXTERNAL);
    if (await openExternalBtn.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_legal_draft_open_external.png` });
    }
}
