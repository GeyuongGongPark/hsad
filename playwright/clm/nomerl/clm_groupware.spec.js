import { test, expect } from '@playwright/test';
import { URLS } from '../../util/url_base_hsad.js';
import { SELECTORS } from '../../util/selector_hsad.js';
import { login } from '../../common/auth.js';

// 그룹웨어(전자결재) / MDM 거래처 연동
// 총 44건

test.describe('그룹웨어(전자결재) / MDM 거래처 연동 - 계약서 검토 요청', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.goto(URLS.CLM.DRAFT);
    });

    test.describe('첨부/별첨', () => {
        test('LC_349: 버튼 - 파일 업로드', async ({ page }) => {
            await expect(page.getByText('파일 업로드\' 버튼', { exact: false })).toBeVisible();
        });

        test('LC_350: 버튼 - 전자결재 문서 연결', async ({ page }) => {
            await expect(page.getByRole('button', { name: /전자결재 문서 연결/ })).toBeVisible();
        });

        test('LC_351: 전자결재 문서 연결 - 팝업 노출', async ({ page }) => {
            await expect(page.getByText('그룹웨어 전자결재 완료 문서 리스트 팝업', { exact: false })).toBeVisible();
        });

        test('LC_352: 전자결재 리스트 - 필터', async ({ page }) => {
            await expect(page.locator('[role="dialog"] table tbody tr')).not.toHaveCount(0);
        });

        test('LC_353: 전자결재 리스트 - 단일 선택 Insert', async ({ page }) => {
            await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        });

        test('LC_354: 전자결재 리스트 - N개 등록', async ({ page }) => {
            await expect(page.locator('[class*="attach"] [class*="item"], [class*="file-item"]')).toHaveCount(2);
        });

        test('LC_355: 노출 방식 - 별도 아이콘', async ({ page }) => {
            await expect(page.locator('[class*="groupware"], [class*="electronic"], [data-type*="groupware"]').first()).toBeVisible();
        });

        test('LC_356: 노출 정보 - ID·타이틀', async ({ page }) => {
            await expect(page.locator('[class*="attach"] [class*="title"], [class*="file-title"]').first()).toBeVisible();
        });

        test('LC_357: 전자결재 문서 항목 - 삭제(X)', async ({ page }) => {
            await expect(page.locator('[data-type*="groupware"], [class*="groupware-item"]')).not.toBeVisible();
        });

    });

    test.describe('상대 계약자 정보', () => {
        test('LC_358: 카테고리 선택 - 옵션', async ({ page }) => {
            await expect(page.getByText('법인', { exact: false })).toBeVisible();
            await expect(page.getByText('개인사업자', { exact: false })).toBeVisible();
            await expect(page.getByText('개인', { exact: false })).toBeVisible();
        });

        test('LC_359: 입력 필드 - 텍스트 + 조회', async ({ page }) => {
            await expect(page.locator('input[placeholder*="회사명"]')).toBeVisible();
        });

        test('LC_360: 입력 필드 - 수기 등록 버튼', async ({ page }) => {
            await expect(page.getByText('수기 등록\' 버튼이 조회 버튼 옆에', { exact: false })).toBeVisible();
        });

        test('LC_361: 조회 동작 - MDM Like 검색', async ({ page }) => {
            await expect(page.locator('[role="dialog"]')).toBeVisible();
        });

    });

    test.describe('거래처 리스트(2-1)', () => {
        test('LC_362: 탭 - 3개 카테고리', async ({ page }) => {
            await expect(page.getByRole('tab', { name: '법인' })).toBeVisible();
        });

        test('LC_363: 법인 - 컬럼', async ({ page }) => {
            await expect(page.getByRole('columnheader', { name: /기업명|법인명/ })).toBeVisible();
        });

        test('LC_364: 개인사업자 - 컬럼', async ({ page }) => {
            await expect(page.getByRole('columnheader', { name: /상호명/ })).toBeVisible();
        });

        test('LC_365: 개인 - 컬럼', async ({ page }) => {
            await expect(page.getByRole('columnheader', { name: /이름/ })).toBeVisible();
        });

        test('LC_366: 페이지네이션 - 10개 단위', async ({ page }) => {
            await expect(page.locator('[role="dialog"] table tbody tr')).not.toHaveCount(0);
        });

        test('LC_367: 선택 동작 - 등록', async ({ page }) => {
            await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        });

        test('LC_368: 등록 제한 - 1회 1건', async ({ page }) => {
            await expect(page.getByText('상대 계약자 정보', { exact: false })).toBeVisible();
        });

        test('LC_369: 조회 결과 - 0건', async ({ page }) => {
            await expect(page.getByText('0건', { exact: false })).toBeVisible();
        });

    });

    test.describe('수기 등록', () => {
        test('LC_370: 팝업(2-3) 노출 - 트리거', async ({ page }) => {
            await expect(page.getByText('거래처 수기 등록\' 팝업', { exact: false })).toBeVisible();
        });

        test('LC_371: 법인 탭 - 입력 필드', async ({ page }) => {
            await expect(page.getByText('기업명', { exact: false })).toBeVisible();
        });

        test('LC_372: 개인사업자 탭 - 입력 필드', async ({ page }) => {
            await expect(page.getByText('상호', { exact: false })).toBeVisible();
        });

        test('LC_373: 개인 탭 - 입력 필드', async ({ page }) => {
            await expect(page.getByText('생년월일', { exact: false })).toBeVisible();
        });

        test('LC_374: 등록 동작 - 법인', async ({ page }) => {
            await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        });

        test('LC_375: 필수값 - 미입력', async ({ page }) => {
            await expect(page.getByRole('button', { name: /등록/ })).toBeDisabled();
        });

        test('LC_376: 포맷 검증 - 이메일', async ({ page }) => {
            await expect(page.getByText(/이메일.*형식|올바른 이메일|이메일 형식/, { exact: false })).toBeVisible();
        });

        test('LC_377: 포맷 검증 - 사업자등록번호', async ({ page }) => {
            await expect(page.getByText(/사업자등록번호.*형식|올바른 사업자|형식.*사업자/, { exact: false })).toBeVisible();
        });

        test('LC_378: 포맷 검증 - 생년월일', async ({ page }) => {
            await expect(page.getByText(/날짜.*형식|형식.*날짜|생년월일.*형식/, { exact: false })).toBeVisible();
        });

    });

});

test.describe('그룹웨어(전자결재) / MDM 거래처 연동 - 검토 요청 상세', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await page.goto(URLS.CLM.DRAFT);
    });

    test.describe('계약 체결 품의 예외', () => {
        test('LC_379: 버튼 - 노출', async ({ page }) => {
            await expect(page.getByText('계약 체결 품의 예외\' 버튼', { exact: false })).toBeVisible();
        });

        test('LC_380: 팝업(3-1) - 노출', async ({ page }) => {
            await expect(page.getByText('계약 체결 품의 예외 등록\' 팝업', { exact: false })).toBeVisible();
        });

        test('LC_381: 팝업(3-1) - 문서 리스트', async ({ page }) => {
            await expect(page.locator('[role="listbox"] [role="option"], select option')).not.toHaveCount(0);
        });

        test('LC_382: 팝업(3-1) - 필수 표시', async ({ page }) => {
            await expect(page.getByText('전자결재 문서 선택', { exact: false })).toBeVisible();
            await expect(page.getByText('예외 사유', { exact: false })).toBeVisible();
        });

        test('LC_383: 팝업(3-1) - 활성화', async ({ page }) => {
            await expect(page.getByRole('button', { name: /등록/ })).toBeEnabled();
        });

        test('LC_384: 팝업(3-2) - 노출', async ({ page }) => {
            await expect(page.getByText('계약 체결 품의 예외 안내\'(3-2) 확인 팝업', { exact: false })).toBeVisible();
        });

        test('LC_385: 팝업(3-2) - 본문', async ({ page }) => {
            await expect(page.getByText(/계약 체결 품의 예외/, { exact: false })).toBeVisible();
        });

        test('LC_386: 팝업(3-2) - 확인 동작', async ({ page }) => {
            await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        });

        test('LC_387: 팝업(3-2) - 취소 동작', async ({ page }) => {
            await expect(page.locator('[role="dialog"]')).toBeVisible();
        });

        test('LC_388: 3-3 항목 - 노출', async ({ page }) => {
            await expect(page.getByText(/등록 일시|품의 예외/, { exact: false })).toBeVisible();
        });

        test('LC_389: 3-3 항목 - 드래프트 미노출', async ({ page }) => {
            await expect(page.getByText('계약 체결 품의 예외 사유', { exact: false })).not.toBeVisible();
        });

        test('LC_390: 다음 단계 - 전자서명/인감사용 신청', async ({ page }) => {
            await expect(page.getByText(/서명 진행 중|인감 사용 신청 중/, { exact: false })).toBeVisible();
        });

        test('LC_391: 마스터 변경 - 3-3 삭제', async ({ page }) => {
            await expect(page.getByText('계약 체결 품의 예외 사유', { exact: false })).not.toBeVisible();
        });

        test('LC_392: 권한 - 마스터 외 차단', async ({ page }) => {
            await expect(page.getByText(/권한이 없|접근 거부|승인되지 않/, { exact: false })).toBeVisible();
        });

    });

});
