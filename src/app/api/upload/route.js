import { NextResponse } from 'next/server';
import { createServerSupabaseClientSimple } from '@/utils/supabase/server-client';
import { checkAndCompressImage } from '@/utils/imageCompression';

// POST /api/upload - 이미지 업로드
export async function POST(request) {
  try {
    console.log('API 업로드 요청 시작');

    const supabase = createServerSupabaseClientSimple();
    const formData = await request.formData();
    const file = formData.get('file');
    const bucket = formData.get('bucket') || 'gallery';
    const maxSizeInMB = parseInt(formData.get('maxSizeInMB')) || 1;

    console.log('업로드 파라미터:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      bucket,
      maxSizeInMB
    });

    if (!file) {
      console.error('파일이 없습니다');
      return NextResponse.json(
        { error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증 (이미지와 일반 파일 모두 허용)
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedDocumentTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/x-7z-compressed'
    ];
    const allowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];
    
    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', '7z'];
    
    // MIME 타입이 없거나 허용되지 않은 경우, 확장자로 검증
    if (!file.type || file.type === '') {
      // MIME 타입이 없는 경우 확장자로 검증
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        console.log('파일 타입 검증 실패 (MIME 타입 없음):', { fileName: file.name, fileExt });
        return NextResponse.json(
          { error: '지원하지 않는 파일 형식입니다.' },
          { status: 400 }
        );
      }
    } else if (!allowedTypes.includes(file.type)) {
      // MIME 타입이 있지만 허용 목록에 없는 경우, 확장자로 재검증
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        console.log('파일 타입 검증 실패:', { fileName: file.name, fileType: file.type, fileExt });
        return NextResponse.json(
          { error: '지원하지 않는 파일 형식입니다.' },
          { status: 400 }
        );
      }
      // 확장자는 허용되지만 MIME 타입이 다른 경우 경고만 출력하고 계속 진행
      console.warn('MIME 타입과 확장자가 일치하지 않지만 확장자는 허용됨:', { fileName: file.name, fileType: file.type, fileExt });
    }

    // 파일 크기 검증 (MB 단위)
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: `파일 크기는 ${maxSizeInMB}MB를 초과할 수 없습니다.` },
        { status: 400 }
      );
    }

    // 이미지 압축 (이미지 파일만)
    let processedFile = file;
    if (allowedImageTypes.includes(file.type)) {
      processedFile = await checkAndCompressImage(file, maxSizeInMB);
    }

    // 파일명 생성 (이미 위에서 추출한 fileExt 사용)
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Supabase Storage에 업로드
    console.log('Supabase 업로드 시작:', { bucket, filePath, fileSize: processedFile.size, fileType: processedFile.type });

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, processedFile);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      console.error('Upload error details:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      });
      return NextResponse.json(
        { error: `파일 업로드 중 오류가 발생했습니다: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 업로드된 이미지의 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('업로드 성공:', { publicUrl, filePath });

    const result = {
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        name: processedFile.name,
        size: processedFile.size,
        originalSize: file.size
      }
    };

    console.log('최종 응답:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
