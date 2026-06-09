import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const internalNoticePageLoad = new Trend('hsad_internal_notice_page_load');
const internalNoticeCreatePageLoad = new Trend('hsad_internal_notice_create_page_load');

const INTERNAL_NOTICE = SELECTORS.BUSINESS.INTERNAL_NOTICE;

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 1. 공지사항 목록 페이지 진입
        await measure(internalNoticePageLoad, () => page.goto(URLS.INTERNAL_NOTICE.LIST));
        const isListPage = page.url().includes('/internal_notice');
        const hasPageTitle = await page.locator(INTERNAL_NOTICE.PAGE_TITLE).isVisible();
        const hasPagination = await page.locator(INTERNAL_NOTICE.PAGINATION).isVisible();

        check(page, {
            'IN_001: 공지사항 목록 페이지 진입 확인': () => isListPage,
            'IN_002: 페이지 타이틀 노출 확인': () => hasPageTitle,
            'IN_003: 페이지네이션 노출 확인': () => hasPagination,
        });

        // 2. 공지사항 작성 페이지 진입
        await measure(internalNoticeCreatePageLoad, () => page.goto(URLS.INTERNAL_NOTICE.CREATE));
        const isCreatePage = page.url().includes('/internal_notice');
        const hasInput = await page.locator(INTERNAL_NOTICE.INPUT).isVisible();
        const hasSaveButton = await page.locator(INTERNAL_NOTICE.SAVE_BUTTON).isVisible();
        const hasCancelButton = await page.locator(INTERNAL_NOTICE.CANCEL_BUTTON).isVisible();

        check(page, {
            'IN_004: 공지사항 작성 페이지 진입 확인': () => isCreatePage,
            'IN_005: 제목 입력란 노출 확인': () => hasInput,
            'IN_006: 저장 버튼 노출 확인': () => hasSaveButton,
            'IN_007: 취소 버튼 노출 확인': () => hasCancelButton,
        });
    } finally {
        await page.close();
    }
}
