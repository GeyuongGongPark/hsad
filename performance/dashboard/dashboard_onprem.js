import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../util/url_base_hsad.js';
import { SELECTORS } from '../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const dashboardOnpremPageLoad = new Trend('hsad_dashboard_onprem_page_load');

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 대시보드 페이지 진입
        await measure(dashboardOnpremPageLoad, () => page.goto(URLS.LOGIN.DASHBOARD));
        const isDashboardPage = page.url().includes('/dashboard') || page.url().includes('/home');

        // 담당자 동시 검토 관련 위젯 노출 확인
        const hasConcurrentReviewWidget = await page.locator('text=담당자 동시 검토 중 리스트').isVisible();
        const hasConcurrentCompleteWidget = await page.locator('text=담당자 동시 검토 완료 리스트').isVisible();

        // 검토 담당자 배정 중 위젯 노출 확인
        const hasAssignmentWidget = await page.locator('text=검토 담당자 배정 중').isVisible();

        // 요청자 검토 중 리스트 위젯 노출 확인
        const hasRequestorReviewWidget = await page.locator('text=요청자 검토 중').isVisible();

        check(page, {
            'DO_001: 대시보드 페이지 진입 확인': () => isDashboardPage,
            'DO_002: 담당자 동시 검토 중 리스트 위젯 노출 확인': () => hasConcurrentReviewWidget,
            'DO_003: 담당자 동시 검토 완료 리스트 위젯 노출 확인': () => hasConcurrentCompleteWidget,
            'DO_004: 검토 담당자 배정 중 위젯 노출 확인': () => hasAssignmentWidget,
            'DO_005: 요청자 검토 중 리스트 위젯 노출 확인': () => hasRequestorReviewWidget,
        });

        // 담당자 동시 검토 상태 항목 확인
        const hasConcurrentReviewStatus = await page.locator('text=담당자 동시 검토 완료').isVisible();

        check(page, {
            'DO_006: 담당자 동시 검토 완료 상태 항목 노출 확인': () => hasConcurrentReviewStatus,
        });
    } finally {
        await page.close();
    }
}
