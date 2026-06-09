import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const legalDraftPageLoad = new Trend('hsad_legal_draft_page_load');

const LEGAL_DRAFT = SELECTORS.BUSINESS.LEGAL_DRAFT;

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 1. 법률 서비스 페이지 진입
        await measure(legalDraftPageLoad, () => page.goto(URLS.LEGAL_DRAFT.LEGAL_DRAFT));
        const isLegalDraftPage = page.url().includes('/legal_draft');
        const hasButton = await page.locator(LEGAL_DRAFT.BUTTON).isVisible();
        const hasAttach = await page.locator(LEGAL_DRAFT.ATTACH).isVisible();
        const hasOpenExternal = await page.locator(LEGAL_DRAFT.OPEN_EXTERNAL).isVisible();

        check(page, {
            'LD_001: 법률 서비스 페이지 진입 확인': () => isLegalDraftPage,
            'LD_002: 버튼 노출 확인': () => hasButton,
            'LD_003: 첨부 버튼 노출 확인': () => hasAttach,
            'LD_004: 외부 열기 버튼 노출 확인': () => hasOpenExternal,
        });
    } finally {
        await page.close();
    }
}
