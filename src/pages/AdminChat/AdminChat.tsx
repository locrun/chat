import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import Chat from 'components/app/chat/Chat';
import { useConnectSocket } from 'hooks/useConnectSocket';
import {
  TopicsContext,
  TopicsContextType
} from 'components/app/topics/TopicsProvider';
import { ChatContext } from 'context/Context';
import { ProfileUserCard } from 'components/ProfileUserCard/ProfileUserCard';
import { ControlMessages } from 'components/ControlMessages/ControlMessages';
import { FilterMessages } from 'components/FilterMessages/FilterMessages';
import {
  getCuratorChats,
  getMessagesListCurator
} from 'api/routes/curatorChat';
import { checkboxData } from 'data/checkboxData';

import { LMSAccounts } from 'api/routes/newLMS';
import cn from 'classnames';

import s from './AdminChat.module.scss';

export const AdminChat = () => {
  const { topics } = useContext(TopicsContext) as TopicsContextType;

  const {
    newMessageSocket,
    threadsDispatch,
    messages,
    setKey,
    currentThread,
    setCurrentThread,
    messagesDispatch,
    setScrollToBottom,
    isAddNewChat,
    setIsAddNewChat,
    setLmsUsers,
    profileCardVisible,
    currentLmsUser
  } = useContext(ChatContext);
  const [checkboxList, setCheckboxList] = useState(checkboxData);

  const [typeMessages, setTypeMessages] = useState('topic');
  const [messagesByDate, setMessagesByDate] = useState('');
  const [statusMessages, setStatusMessages] = useState('');
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>('');
  const [chosenCheckboxes, setChosenCheckboxes] = useState<string[]>([]);
  const [topicType, setTopicType] = useState('');
  const [unreadMessageCount, setUnreadMessageCount] = useState<number>(0);
  const [isMyThreads, setIsMyThreads] = useState(false);
  useConnectSocket();

  useEffect(() => {
    const getCuratorMessages = async () => {
      const {
        data: { results }
      } = await getCuratorChats({});

      const findChatById = results.find(
        thread => thread.id === newMessageSocket?.data.chat
      );

      if (findChatById && currentThread?.id === findChatById?.id) {
        const { data: messages } = await getMessagesListCurator({
          id: findChatById.id
        });

        messagesDispatch({
          type: 'SET_MESSAGES',
          payload: messages.results
        });
      }
    };

    getCuratorMessages();
  }, [newMessageSocket, currentThread]);

  const handleChangeRadio = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioValue(event.target.value);
    setCheckboxList(prevCheckboxes => {
      return prevCheckboxes.map(checkbox => {
        return { ...checkbox, isChecked: true };
      });
    });
  };

  const handleChangeCheckbox = (id: number) => {
    const hasCheckedCheckbox = checkboxList.some(item => {
      return item.isChecked;
    });

    if (hasCheckedCheckbox) {
      setSelectedRadioValue('');
    }
    setCheckboxList(prevCheckboxes => {
      return prevCheckboxes.map(checkbox => {
        if (checkbox.id === id)
          return { ...checkbox, isChecked: !checkbox.isChecked };
        else {
          return checkbox;
        }
      });
    });
  };

  useEffect(() => {
    setIsMyThreads(chosenCheckboxes.includes('my'));
  }, [chosenCheckboxes]);

  useEffect(() => {
    const selectedValues = checkboxList
      .filter(checkbox => checkbox.isChecked)
      .map(checkbox => checkbox.value);
    setChosenCheckboxes(selectedValues);

    const hasCheckedCheckbox = checkboxList.every(item => {
      return item.isChecked;
    });
    if (hasCheckedCheckbox) {
      setSelectedRadioValue('all');
    }
  }, [checkboxList]);

  useEffect(() => {
    const selectedValuesString =
      chosenCheckboxes.length > 0 ? chosenCheckboxes.join(',') : null;

    const fetchDialogs = async () => {
      const params = {
        chat_type: typeMessages,
        ordering: messagesByDate,
        status: statusMessages,
        chats: selectedValuesString || selectedRadioValue,
        topic: topicType
      };

      const { data: users } = await LMSAccounts();

      setLmsUsers(users);

      const { data } = await getCuratorChats(params);

      setUnreadMessageCount(data.results.length);

      threadsDispatch({
        type: 'SET_DIALOGS',
        payload: data.results
      });

      const thread = data.results[0];
      if (thread && isAddNewChat) {
        setKey(thread.id);
        setCurrentThread(thread);

        const { data: messages } = await getMessagesListCurator({
          id: thread.id
        });

        messagesDispatch({
          type: 'SET_MESSAGES',
          payload: messages.results
        });
        setIsAddNewChat(false);
        setScrollToBottom(true);
      }
    };

    fetchDialogs();
  }, [
    typeMessages,
    messagesByDate,
    statusMessages,
    selectedRadioValue,
    chosenCheckboxes,
    topicType,
    messages
  ]);

  /* TODO: wait changes
  const getUnreadMessages = (threads: ChatList[]) => {
    let unreadMessage = 0;
    threads.forEach(thread => {
      if (thread.unread_messages_count) {
        unreadMessage += thread.unread_messages_count;
      }
    });

    setUnreadMessageCount(unreadMessage);
  };*/

  const handleTypeMessagesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTypeMessages(event.target.value);
  };

  const handleSortingMessagesChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setMessagesByDate(event.target.value);
  };

  const handleStatusMessagesChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusMessages(event.target.value);
  };

  const handleTypeTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTopicType(event.target.value);
  };

  return (
    <div className={s.container}>
      <FilterMessages
        checkboxList={checkboxList}
        isChecked={selectedRadioValue === 'all'}
        handleChangeRadio={handleChangeRadio}
        handleChangeCheckbox={handleChangeCheckbox}
        handleTypeMessagesChange={handleTypeMessagesChange}
        handleStatusMessagesChange={handleStatusMessagesChange}
        handleSortingMessagesChange={handleSortingMessagesChange}
      />

      {typeMessages === 'topic' && (
        <ControlMessages
          topics={topics}
          isMyThreads={isMyThreads}
          handleTypeTopicChange={handleTypeTopicChange}
          unreadMessagesCount={unreadMessageCount}
        />
      )}

      <div
        className={cn(s.chatWrapper, {
          [s.extraChatWrapper]: typeMessages
        })}
      >
        <Chat />
        <div
          className={cn(s.profileCardWrapper, {
            [s.extraProfileCardWrapper]: typeMessages
          })}
        >
          {profileCardVisible && currentLmsUser && <ProfileUserCard />}
        </div>
      </div>
    </div>
  );
};
