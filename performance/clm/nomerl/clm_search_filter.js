import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../../util/url_base_hsad.js';
import { SELECTORS } from '../../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const searchFilterPageLoad = new Trend('hsad_search_filter_page_load');

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 검토 요청 조회 페이지 진입
        await measure(searchFilterPageLoad, () => page.goto(URLS.CLM.REVIEW));
        const isReviewPage = page.url().includes('/clm/review') || page.url().includes('/clm');

        // 특별 승인 요청 필터 노출 확인
        const hasSpecialApprovalFilter = await page.locator('text=특별 승인 요청').isVisible();

        // 담당자 동시 검토 필터 항목 확인
        const hasConcurrentReviewFilter = await page.locator('text=담당자 동시 검토 중').isVisible();
        const hasConcurrentReviewCompleteFilter = await page.locator('text=담당자 동시 검토 완료').isVisible();

        // 부서별 필터 옵션 확인
        const hasLegalFilter = await page.locator('text=법무').isVisible();
        const hasFinanceFilter = await page.locator('text=금융').isVisible();

        check(page, {
            'SF_001: 검토 요청 조회 페이지 진입 확인': () => isReviewPage,
            'SF_002: 특별 승인 요청 필터 노출 확인': () => hasSpecialApprovalFilter,
            'SF_003: 담당자 동시 검토 중 필터 항목 노출 확인': () => hasConcurrentReviewFilter,
            'SF_004: 담당자 동시 검토 완료 필터 항목 노출 확인': () => hasConcurrentReviewCompleteFilter,
            'SF_005: 법무 부서 필터 옵션 노출 확인': () => hasLegalFilter,
            'SF_006: 금융 부서 필터 옵션 노출 확인': () => hasFinanceFilter,
        });
    } finally {
        await page.close();
    }
}
