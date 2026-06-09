import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../selector_hsad.js';
import { hsadBrowserOptions, measure } from '../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const resetPasswordPageLoad = new Trend('hsad_reset_password_page_load');

const RESET_PASSWORD = SELECTORS.BUSINESS.RESET_PASSWORD;

export default async function () {
    const page = await browser.newPage();
    try {
        // 로그인 불필요 — 비밀번호 재설정은 독립 플로우
        await measure(resetPasswordPageLoad, () => page.goto(URLS.RESET_PASSWORD.RESET_PASSWORD));
        const isResetPasswordPage = page.url().includes('/reset_password');
        const hasEmailInput = await page.locator(RESET_PASSWORD.EMAIL_PLACEHOLDER).isVisible();
        const hasSendCodeButton = await page.locator(RESET_PASSWORD.BUTTON_CLICK_SEND_CODE).isVisible();
        const hasLoginButton = await page.locator(RESET_PASSWORD.LOGIN_BUTTON).isVisible();

        check(page, {
            'RP_001: 비밀번호 재설정 페이지 진입 확인': () => isResetPasswordPage,
            'RP_002: 이메일 입력란 노출 확인': () => hasEmailInput,
            'RP_003: 인증 코드 발송 버튼 노출 확인': () => hasSendCodeButton,
            'RP_004: 로그인 링크 노출 확인': () => hasLoginButton,
        });

        // 이메일 입력 후 코드 발송 버튼 활성화 확인
        const testEmail = (typeof __ENV !== 'undefined' && __ENV.RESET_EMAIL)
            ? __ENV.RESET_EMAIL
            : 'test@example.com';
        await page.locator(RESET_PASSWORD.EMAIL_PLACEHOLDER).fill(testEmail);

        const isSendCodeEnabled = await page.locator(RESET_PASSWORD.BUTTON_CLICK_SEND_CODE).isEnabled();

        check(page, {
            'RP_005: 이메일 입력 후 코드 발송 버튼 활성화 확인': () => isSendCodeEnabled,
        });
    } finally {
        await page.close();
    }
}
