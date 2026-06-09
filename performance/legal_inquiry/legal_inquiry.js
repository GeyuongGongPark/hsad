import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const legalInquiryPageLoad = new Trend('hsad_legal_inquiry_page_load');

const LEGAL_INQUIRY = SELECTORS.BUSINESS.LEGAL_INQUIRY;

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 1. 법률 문의 페이지 진입
        await measure(legalInquiryPageLoad, () => page.goto(URLS.LEGAL_INQUIRY.LEGAL_INQUIRY));
        const isLegalInquiryPage = page.url().includes('/legal_inquiry');
        const hasButton = await page.locator(LEGAL_INQUIRY.BUTTON).isVisible();
        const hasAttach = await page.locator(LEGAL_INQUIRY.ATTACH).isVisible();

        check(page, {
            'LI_001: 법률 문의 페이지 진입 확인': () => isLegalInquiryPage,
            'LI_002: 문의 버튼 노출 확인': () => hasButton,
            'LI_003: 첨부 버튼 노출 확인': () => hasAttach,
        });
    } finally {
        await page.close();
    }
}
