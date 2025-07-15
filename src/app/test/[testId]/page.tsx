import React from 'react';

export async function generateStaticParams() {
  return [{ testId: '1' }, { testId: '2' }];
}

const TestPage = async ({ params }: { params: { testId: string } }) => {
  const { testId } = await params;

  return (
    <div>
      <h1>Test Dynamic Route Page</h1>
      <p>The ID is: {testId}</p>
    </div>
  );
};

export default TestPage;