import React from 'react';
import { PageTitle } from '../components/PageTitle';

export default function Terms() {
  return (
    <div className="page">
      <PageTitle title="Пользовательское соглашение" />
      <div className="tg-card">
        <p>Текст пользовательского соглашения будет размещён здесь.</p>
        <p>Вы можете вставить полный текст из документа, подготовленного ранее.</p>
      </div>
    </div>
  );
}