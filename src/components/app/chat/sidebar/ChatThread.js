import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useKeycloak } from '@react-keycloak/web';
import { checkAllRealmRolesAssigned } from 'helpers/utils';
import keycloakRealmRoles from 'helpers/keycloakRealmRoles';
import LastMessage from './LastMessage';
import { getMessagesListCurator } from 'api/routes/curatorChat';
import { getMessagesListClient } from 'api/routes/clientChat';
import { markChatMessagesAsReadClient } from 'api/routes/clientChat';
import { markChatMessagesAsReadCurator } from 'api/routes/curatorChat';
import Flex from 'components/common/Flex';
import classNames from 'classnames';
import Avatar from 'components/common/Avatar';
import { Nav } from 'react-bootstrap';

import ChatSidebarDropdownAction from './ChatSidebarDropdownAction';
import { ChatContext } from 'context/Context';
import { getUserLMS } from 'helpers/getUserLMS';

const ChatThread = ({ thread, index }) => {
  const { messagesDispatch } = useContext(ChatContext);

  const { keycloak } = useKeycloak();

  const isChatClient = checkAllRealmRolesAssigned(keycloak.realmAccess.roles, [
    keycloakRealmRoles.CHAT_USER
  ]);

  const fetchMessagesList = async () => {
    try {
      const { data } = isChatClient
        ? await getMessagesListClient({ id: thread.id })
        : await getMessagesListCurator({ id: thread.id });

      messagesDispatch({
        type: 'SET_MESSAGES',
        payload: data.results
      });

      if (isChatClient) {
        if (thread.last_message) {
          await markChatMessagesAsReadClient({
            chat_id: thread?.id,
            message_id: thread.last_message.id
          });
        }
      } else {
        if (thread.last_message) {
          await markChatMessagesAsReadCurator({
            chat_id: thread?.id,
            message_id: thread.last_message?.id
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const user = getUserLMS(thread.client);

  let userAvatar = user?.profile_image?.image_url_medium
    ? user.profile_image.image_url_medium
    : thread.topic.logo;

  const getFormattedDate = time => {
    if (!time) {
      return '';
    }
    const monthName = new Intl.DateTimeFormat('ru-RU', {
      month: 'long'
    }).format(new Date(time));
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  const is_read = thread?.last_message?.is_read;
  return (
    <Nav.Link
      eventKey={index}
      onClick={() => fetchMessagesList(index)}
      className={classNames(`chat-contact hover-actions-trigger p-3`, {
        'unread-message': !thread.last_message?.is_read,
        'read-message': thread.last_message?.is_read,
        'blocked-message': thread.status === 'closed'
      })}
    >
      <div className="d-md-none d-lg-block">
        <ChatSidebarDropdownAction />
      </div>
      <Flex justifyContent="center">
        <Avatar className={thread.status} src={userAvatar} size="xl" />
        <div className="flex-1 chat-contact-body ms-2 d-md-none d-lg-block">
          <Flex justifyContent="between">
            <h6 className="mb-0 chat-contact-title">
              {user ? user.username : thread.topic.title}
            </h6>
            <span className="message-time fs-11">
              {getFormattedDate(thread.last_message?.created_at)}
            </span>
          </Flex>
          <div className="min-w-0">
            <div className="chat-contact-content pe-3">
              <LastMessage lastMessage={thread.last_message} />

              <FontAwesomeIcon
                icon={is_read ? 'check-double' : 'check'}
                size="xs"
                className="position-absolute bottom-0 end-0 hover-hide"
                color="rgb(182 193 210)"
              />
            </div>
          </div>
        </div>
      </Flex>
    </Nav.Link>
  );
};

ChatThread.propTypes = {
  thread: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default ChatThread;
