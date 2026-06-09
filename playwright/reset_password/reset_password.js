/**
 * 비밀번호 재설정 시나리오 - Playwright용
 * 플로우: 비밀번호 재설정 페이지 진입 (로그인 불필요) → 이메일 입력 → 인증 코드 발송
 *         → 코드 입력 → 확인 → 다음 단계 → 비밀번호 재설정 → 로그인 페이지 이동 확인
 *
 * 참고: 실제 이메일 인증 코드 수신이 필요하므로 인증 코드 이후 단계는 환경에 따라 제한될 수 있음
 */
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../util/selector_hsad.js';
import { getFormattedTimestamp } from '../util/utils.js';

const {
    CONFIRM_BUTTON,
    LOGIN_BUTTON,
    NEXT_BUTTON,
    BUTTON_CLICK_SEND_CODE,
    RESET_BUTTON,
    EMAIL_PLACEHOLDER,
    PHONE_PLACEHOLDER,
    CODE_PLACEHOLDER,
} = SELECTORS.BUSINESS.RESET_PASSWORD;

/**
 * @param {import('@playwright/test').Page} page
 * 로그인 없이 독립 실행
 */
export async function run(page) {
    const getNewTimestamp = () => getFormattedTimestamp().replace(/:/g, '_');

    // 1. 비밀번호 재설정 페이지 직접 이동 (로그인 불필요)
    await page.goto(URLS.RESET_PASSWORD.RESET_PASSWORD);
    await page.waitForSelector(EMAIL_PLACEHOLDER);
    let timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_reset_password_page.png` });

    // 로그인 링크 확인
    const loginBtn = page.locator(LOGIN_BUTTON);
    if (await loginBtn.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_reset_password_login_link.png` });
    }

    // 2. 이메일 입력
    const testEmail = process.env.RESET_EMAIL || 'test@example.com';
    await page.locator(EMAIL_PLACEHOLDER).fill(testEmail);
    timestamp = getNewTimestamp();
    await page.screenshot({ path: `screenshots/${timestamp}_reset_password_email_input.png` });

    // 전화번호 입력란이 있으면 확인
    const phoneInput = page.locator(PHONE_PLACEHOLDER);
    if (await phoneInput.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_reset_password_phone_visible.png` });
    }

    // 3. 인증 코드 발송 버튼 클릭
    const sendCodeBtn = page.locator(BUTTON_CLICK_SEND_CODE);
    if (await sendCodeBtn.isVisible()) {
        await sendCodeBtn.click();
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_reset_password_code_sent.png` });
    }

    // 4. 코드 입력란 표시 확인
    const codeInput = page.locator(CODE_PLACEHOLDER);
    if (await codeInput.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_reset_password_code_input_visible.png` });

        // 실제 코드 없이는 이후 단계 진행 불가 → 버튼 표시만 확인
        const confirmBtn = page.locator(CONFIRM_BUTTON);
        if (await confirmBtn.isVisible()) {
            timestamp = getNewTimestamp();
            await page.screenshot({ path: `screenshots/${timestamp}_reset_password_confirm_button.png` });
        }
    }

    // 5. 다음 단계 / 재설정 버튼 확인 (화면 흐름에 따라 표시될 경우)
    const nextBtn = page.locator(NEXT_BUTTON);
    if (await nextBtn.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_reset_password_next_button.png` });
    }

    const resetBtn = page.locator(RESET_BUTTON);
    if (await resetBtn.isVisible()) {
        timestamp = getNewTimestamp();
        await page.screenshot({ path: `screenshots/${timestamp}_reset_password_reset_button.png` });
    }
}
