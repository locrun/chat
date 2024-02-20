import React from 'react';
import { useState } from 'react';
import Chat from 'components/app/chat/Chat';
import CheckBoxGroup from '../components/CheckBoxGroup/CheckBoxGroup';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import ProfileUserCard from 'components/ProfileUserCard/ProfileUserCard';
import MessageStarting from 'components/message-starting/MessageStarting';
import { ServiceCards } from 'components/ServiceCards/ServiceCards';
import { checkbox } from 'data/checkboxses';
import Search from 'components/doc-components/Search';
import { Dropdowns } from 'components/dropdown';

export const Example = () => {
  const [checkboxses, setCheckboxes] = useState(checkbox);

  const handleChangeCheckbox = id => {
    const updatedCheckboxes = checkboxses.map(checkbox => {
      if (checkbox.id === id) {
        return { ...checkbox, isChecked: !checkbox.isChecked };
      } else {
        return checkbox;
      }
    });
    setCheckboxes(updatedCheckboxes);
  };
  const handleChangeRadio = selected => {
    console.log(selected.value);
  };

  const DROPDOWNITEMS /*: TItems[]*/ = [
    {
      item: 'Все категории',
      eventKey: 'Все категории',
      quantity: 45
    },
    {
      item: 'Все сообщения',
      eventKey: 'Все сообщения',
      quantity: 77
    },
    {
      item: 'По умолчанию',
      eventKey: 'По умолчанию',
      quantity: 77
    }
  ];

  const [selectValue, setSelectValue] = useState(DROPDOWNITEMS[0].eventKey);

  const [month, setMonth] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <ProfileUserCard />
      <ServiceCards />
      <div style={{ width: '854px' }}>
        <Chat />
      </div>
      <MessageStarting />
      <CheckBoxGroup
        checkboxes={checkboxses}
        handleChange={handleChangeCheckbox}
      />
      <RadioGroup
        button={undefined}
        selected={undefined}
        handleChange={handleChangeRadio}
        name="Все"
      />
      <div style={{ width: '100%' }}>
        <Search />
      </div>
      <div style={{ width: '800px', display: 'flex', gap: '10px' }}>
        <Dropdowns
          type={'dropdownBtnCode'}
          items={DROPDOWNITEMS}
          title="Chat theme"
          onSelect={console.log}
        />
        <Dropdowns
          type={'dropdownBtnCode'}
          items={DROPDOWNITEMS}
          title={selectValue}
          onSelect={setSelectValue}
        />
      </div>
    </div>
  );
};
