import React from 'react';
import { PageTitle } from '../components/PageTitle';

export default function Privacy() {
  return (
    <div className="page">
      <PageTitle title="Политика конфиденциальности" />
      <div className="tg-card">
        <p>Текст политики конфиденциальности будет размещён здесь.</p>
        <p>Вы можете вставить полный текст из документа, подготовленного ранее.</p>
      </div>
    </div>
  );
}