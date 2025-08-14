import InterviewDetailContainer from '@/container/InterviewDetailContainer';

function InterviewDetailPage({ params }) {
  return (
    <>
      <InterviewDetailContainer interviewId={params.id} />
    </>
  );
}

export default InterviewDetailPage;