import React from 'react';
import s from '../Payment.module.scss';
import { CgCheck } from 'react-icons/cg';

export const Completed = () => {
  return (
    <div className={s.paymentWrapper}>
      <div className={s.header}>
        <div className={s.paymentStatus}>
          <span className={s.orderId}>Заказ #349363</span>
          <span className={s.completedStatus}>
            <CgCheck color="ffffff" className={s.check} />
            <span>Завершен</span>
          </span>
        </div>
        <div className={s.infoBlock}>
          <span className={s.courseName}>
            Мышление в консультативном процессе
          </span>
          <span className={s.price}>10 ₽</span>
        </div>
        <span className={s.date}>10.10.2023 г. 15:00</span>
      </div>
      <div className={s.orderStatusInfo}>
        <div className={s.flexCol}>
          <span className={s.changeStatus}>Статус изменен</span>
          <span className={s.statusName}>Новый → Завершен</span>
        </div>
        <div className={s.time}>09.10.23 22:22</div>
      </div>
      <div className={s.orderStatusInfo}>
        <div className={s.flexCol}>
          <span className={s.changeStatus}>Заказ создан</span>
          <span className={s.statusName}>
            Мышление в консультативном процессе
          </span>
        </div>
        <div className={s.time}>09.10.23 22:22</div>
      </div>
    </div>
  );
};
