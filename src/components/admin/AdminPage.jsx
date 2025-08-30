import { useRouter } from 'next/navigation';
import * as S from '@/styles/admin/AdminLayout.style';
import Button from './Button';

const AdminPage = ({
  title,
  createPath,
  isLoading,
  error,
  items,
  renderItem,
  onDelete,
  emptyMessage,
}) => {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push(`${createPath}/create`);
  };

  const handleEdit = (id) => {
    router.push(`${createPath}/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      try {
        await onDelete(id);
        alert('항목이 삭제되었습니다.',);
        // 목록 새로고침
        window.location.reload();
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (isLoading) {
    return (
      <S.AdminPageWrapper>
        <S.AdminHeader>
          <h1>{title}</h1>
          <Button className="create" onClick={handleCreateNew}>등록하기</Button>
          <S.LoadingMessage>목록을 불러오는 중...</S.LoadingMessage>
        </S.AdminHeader>
      </S.AdminPageWrapper>
    );
  }

  if (error) {
    return (
      <S.AdminPageWrapper>
        <S.AdminHeader>
          <h1>{title}</h1>
          <Button className="create" onClick={handleCreateNew}>등록하기</Button>
          <S.ErrorMessage>
            오류가 발생했습니다: {error.message}
          </S.ErrorMessage>
        </S.AdminHeader>
      </S.AdminPageWrapper>
    );
  }

  return (
    <S.AdminPageWrapper>
      <S.AdminHeader>
        <h1>{title}</h1>
        <Button className="create" onClick={handleCreateNew}>등록하기</Button>
      </S.AdminHeader>
      {items.length === 0 ? (
        <S.EmptyMessage>{emptyMessage}</S.EmptyMessage>
      ) : (
        <S.AdminList>
          {items.map((item) => (
            <S.AdminCard key={item.id}>
              {renderItem(item)}
              <S.AdminActions>
                <Button
                  className="edit"
                  onClick={() => handleEdit(item.id)}
                >
                  수정
                </Button>
                <Button
                  className="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </Button>
              </S.AdminActions>
            </S.AdminCard>
          ))}
        </S.AdminList>
      )}
    </S.AdminPageWrapper>
  );
};

export default AdminPage;
