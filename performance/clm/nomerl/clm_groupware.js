import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { URLS } from '../../util/url_base_hsad.js';
import { SELECTORS } from '../../selector_hsad.js';
import { hsadBrowserOptions, loginToDashboard, measure } from '../../common/k6_browser_helpers.js';

export const options = hsadBrowserOptions;

const groupwareDraftPageLoad = new Trend('hsad_groupware_draft_page_load');

export default async function () {
    const page = await browser.newPage();
    try {
        await loginToDashboard(page, URLS, SELECTORS);

        // 계약서 작성(드래프트) 페이지 진입
        await measure(groupwareDraftPageLoad, () => page.goto(URLS.CLM.DRAFT));
        const isDraftPage = page.url().includes('/clm/draft') || page.url().includes('/clm');

        // 전자결재 문서 연결 버튼 확인
        const hasGroupwareBtn = await page.locator('[role="button"]:has-text("전자결재 문서 연결"), button:has-text("전자결재 문서 연결")').isVisible();

        // 상대 계약자 정보 - 카테고리 옵션 확인
        const hasCorpOption = await page.locator('text=법인').isVisible();
        const hasSoleOption = await page.locator('text=개인사업자').isVisible();
        const hasIndivOption = await page.locator('text=개인').isVisible();

        check(page, {
            'GW_001: 계약서 작성 페이지 진입 확인': () => isDraftPage,
            'GW_002: 전자결재 문서 연결 버튼 노출 확인': () => hasGroupwareBtn,
            'GW_003: 법인 카테고리 옵션 노출 확인': () => hasCorpOption,
            'GW_004: 개인사업자 카테고리 옵션 노출 확인': () => hasSoleOption,
            'GW_005: 개인 카테고리 옵션 노출 확인': () => hasIndivOption,
        });

        // 계약 체결 품의 예외 섹션 미노출 확인 (draft 기본 상태)
        const hasExceptionSection = await page.locator('text=계약 체결 품의 예외 사유').isVisible();

        // 수기 등록 팝업 필드 확인
        const hasCompanyNameField = await page.locator('text=기업명').isVisible();

        check(page, {
            'GW_006: 계약 체결 품의 예외 사유 섹션 미노출 확인 (draft 상태)': () => !hasExceptionSection,
            'GW_007: 기업명 입력 필드 노출 확인': () => hasCompanyNameField,
        });
    } finally {
        await page.close();
    }
}
