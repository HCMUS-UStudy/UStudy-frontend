import React from 'react';

const CourseDocumentsPage = async ({ params }: { params: { subject: string } }) => {
  const { subject } = await params;

  switch(decodeURIComponent(subject)){
    case "Toán học": {
        return(<h1>Doc for Toans</h1>)
        break;
    }
    case "Ngữ văn": {
        return(<h1>Doc for Văn hello</h1>)
        break;
    }
    default:{
        return(<h1>Khong ton tai</h1>)
        break;
    }

  }
};

export default CourseDocumentsPage;
