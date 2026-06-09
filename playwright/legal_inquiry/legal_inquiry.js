/**
 * 법률 문의 (Legal Inquiry) 시나리오 - Playwright용
 * 플로우: 법률 문의 진입 → 문의 버튼 확인 → 첨부 클릭 → 플로우 확인
 */
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../util/selector_hsad.js';
import { getFormattedTimestamp } from '../util/utils.js';
import { getCredentials, loginWithPage } from '../login/login_helper.js';

const {
    BUTTON,
    ATTACH,
    ATTACH_1,
} = SELECTORS.BUSINESS.LEGAL_INQUIRY;

/**
 * @param {import('@playwright/test').Page} page
 */
export async function run(page) {
    const credentials = getCredentials();
    const getNewTimestamp = () => getFormattedTimestamp().replace(/:/g, '_');

    await loginWithPage(page, credentials);

    // 1. 법률 문의 페이지 진입
    await page.goto(URLS.LEGAL_INQUIRY.LEGAL_INQUIRY);
    await page.waitForSelector(BUTTON);
    let timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_legal_inquiry_list.png` });

    // 2. 문의 버튼 표시 확인
    await page.locator(BUTTON).isVisible();
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_legal_inquiry_button_visible.png` });

    // 3. 첨부 버튼 클릭 → 파일 첨부 플로우 진입 확인
    const attachBtn = page.locator(ATTACH);
    if (await attachBtn.isVisible()) {
        await attachBtn.click();
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_legal_inquiry_attach_clicked.png` });

        // 추가 첨부 버튼 확인
        const attach1 = page.locator(ATTACH_1);
        if (await attach1.isVisible()) {
            timestamp = getNewTimestamp();
            await page.screenshot({ path: `screenshots/${timestamp}_legal_inquiry_attach1_visible.png` });
        }
    }
}
