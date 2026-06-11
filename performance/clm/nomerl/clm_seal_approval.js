import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../../util/url_base_hsad.js';
import { SELECTORS } from '../../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const sealApprovalPageLoad = new Trend('hsad_seal_approval_page_load');

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 인감 사용 신청 리스트 진입
        await measure(sealApprovalPageLoad, () => page.goto(URLS.CLM.REVIEW));
        const isReviewPage = page.url().includes('/clm/review') || page.url().includes('/clm');

        // 결재선 관련 요소 확인
        const hasLegalMember = await page.locator('text=법무팀원').isVisible();
        const hasDepartment = await page.locator('text=현업부서').isVisible();

        check(page, {
            'SA_001: 인감 사용 신청 리스트 페이지 진입 확인': () => isReviewPage,
            'SA_002: 현업부서 결재선 노출 확인': () => hasDepartment,
            'SA_003: 법무팀원 결재선 노출 확인': () => hasLegalMember,
        });

        // 첫 항목 클릭 → 상세 진입
        const firstRow = page.locator(SELECTORS.BUSINESS.CLM.FIRST_ROW);
        if (await firstRow.isVisible()) {
            await firstRow.click();

            const isDetailPage = page.url().includes('/clm/review');
            const hasSealInUse = await page.locator('text=사용 인감').isVisible();
            const hasCorporateSeal = await page.locator('text=법인 인감').isVisible();
            const hasContractSeal = await page.locator('text=계약 인감').isVisible();
            const hasDraftStatus = await page.locator('text=기안').isVisible();

            check(page, {
                'SA_004: 인감 사용 신청 상세 페이지 진입 확인': () => isDetailPage,
                'SA_005: 사용 인감 노출 확인': () => hasSealInUse,
                'SA_006: 법인 인감 옵션 노출 확인': () => hasCorporateSeal,
                'SA_007: 계약 인감 옵션 노출 확인': () => hasContractSeal,
                'SA_008: 기안 상태 노출 확인': () => hasDraftStatus,
            });

            // 인감 사용 신청 URL 확인
            const isSealPage = page.url().includes('/seal');
            check(page, {
                'SA_009: 인감 관련 URL 포함 확인': () => isSealPage,
            });
        }
    } finally {
        await page.close();
    }
}
