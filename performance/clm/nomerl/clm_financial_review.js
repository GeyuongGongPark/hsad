import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../../util/url_base_hsad.js';
import { SELECTORS } from '../../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const financialReviewPageLoad = new Trend('hsad_financial_review_page_load');

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 재무 검토 리스트 진입
        await measure(financialReviewPageLoad, () => page.goto(URLS.CLM.REVIEW));
        const isReviewPage = page.url().includes('/clm/review') || page.url().includes('/clm');

        // 핵심 요소 노출 확인
        const hasCompleteReviewBtn = await page.locator(SELECTORS.BUSINESS.CLM.COMPLETE_REVIEW_BUTTON).isVisible();
        const hasExpandAll = await page.locator('text=전체 펼치기').isVisible();
        const hasRequestorReviewStatus = await page.locator('text=요청자 검토 중').isVisible();

        check(page, {
            'FR_001: 재무 검토 리스트 페이지 진입 확인': () => isReviewPage,
            'FR_002: 검토 완료 버튼 노출 확인': () => hasCompleteReviewBtn,
            'FR_003: 전체 펼치기 노출 확인': () => hasExpandAll,
        });

        // 목록에서 첫 항목 클릭 → 상세 진입
        const firstRow = page.locator(SELECTORS.BUSINESS.CLM.FIRST_ROW);
        if (await firstRow.isVisible()) {
            await firstRow.click();

            const isDetailPage = page.url().includes('/clm/review');
            const hasFinalApprovalStatus = await page.locator('text=최종 결재 중').isVisible();
            const hasLegalReviewer = await page.locator('text=법무').isVisible();

            check(page, {
                'FR_004: 재무 검토 상세 페이지 진입 확인': () => isDetailPage,
                'FR_005: 최종 결재 중 상태 노출 확인': () => hasFinalApprovalStatus,
                'FR_006: 법무 검토자 섹션 노출 확인': () => hasLegalReviewer,
                'FR_007: 요청자 검토 중 상태 노출 확인': () => hasRequestorReviewStatus,
            });
        }
    } finally {
        await page.close();
    }
}
