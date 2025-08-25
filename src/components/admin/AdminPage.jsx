import { useRouter } from 'next/navigation';
import {
  AdminPageWrapper,
  AdminHeader,
  CreateButton,
  AdminList,
  AdminCard,
  AdminActions,
  ActionButton,
  LoadingMessage,
  EmptyMessage,
  ErrorMessage
} from '@/styles/admin/AdminLayout';

const AdminPage = ({
  title,
  createPath,
  isLoading,
  error,
  items,
  emptyMessage,
  renderItem,
  onDelete,
}) => {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push(createPath);
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
      <AdminPageWrapper>
        <AdminHeader>
          <h1>{title}</h1>
          <CreateButton onClick={handleCreateNew}>{createButtonText}</CreateButton>
        </AdminHeader>
        <LoadingMessage>목록을 불러오는 중...</LoadingMessage>
      </AdminPageWrapper>
    );
  }

  if (error) {
    return (
      <AdminPageWrapper>
        <AdminHeader>
          <h1>{title}</h1>
          <CreateButton onClick={handleCreateNew}>{createButtonText}</CreateButton>
        </AdminHeader>
        <ErrorMessage>
          오류가 발생했습니다: {error.message}
        </ErrorMessage>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      <AdminHeader>
        <h1>{title}</h1>
        <CreateButton onClick={handleCreateNew}>등록하기</CreateButton>
      </AdminHeader>

      {items.length === 0 ? (
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      ) : (
        <AdminList>
          {items.map((item) => (
            <AdminCard key={item.id}>
              {renderItem(item)}
              <AdminActions>
                <ActionButton
                  className="edit"
                  onClick={() => handleEdit(item.id)}
                >
                  수정
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </ActionButton>
              </AdminActions>
            </AdminCard>
          ))}
        </AdminList>
      )}
    </AdminPageWrapper>
  );
};

export default AdminPage;
