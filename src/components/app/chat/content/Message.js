import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import Avatar from 'components/common/Avatar';
import classNames from 'classnames';
import s from './content.module.scss';
import { Files } from './Files/Files';

const Message = ({
  avatar,
  message,
  time,
  is_my,
  files,
  is_read_currentMessage
}) => {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const NewTime = `${hours}:${minutes}`;

  return (
    <Flex
      className={classNames('p-3', 'd-block', {
        [s.isMyMessage]: is_my
      })}
    >
      <div>
        <div className={s.messageWrapper}>
          <div
            className={classNames(s.messageBlock, {
              [s.isMyMessage]: is_my
            })}
          >
            {!is_my && <Avatar size="l" className="me-2" src={avatar} />}
            {message && (
              <div
                className={classNames(s.message, {
                  [s.isMy]: is_my && message,
                  [s.another]: !is_my && message
                })}
              >
                <p>{message}</p>
              </div>
            )}
          </div>
          <Files files={files} isMy={is_my} />
        </div>
        <div
          className={classNames(s.messageFooter, {
            [s.isMyFooter]: is_my
          })}
        >
          <div className={s.time}>
            <span>{NewTime}</span>
          </div>
          {is_my &&
            (is_read_currentMessage.is_read_message ||
            is_read_currentMessage.is_read ? (
              <FontAwesomeIcon icon="check-double" color="rgb(182 193 210)" />
            ) : (
              <FontAwesomeIcon icon="check" color="rgb(182 193 210)" />
            ))}
        </div>
      </div>
    </Flex>
  );
};
Message.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  time: PropTypes.string.isRequired,
  is_my: PropTypes.bool,
  files: PropTypes.array,
  is_read_currentMessage: PropTypes.shape({
    is_read_message: PropTypes.bool,
    is_read: PropTypes.bool,
    currentThread: PropTypes.shape({
      id: PropTypes.number,
      chat_type: PropTypes.string,
      created_at: PropTypes.string,
      last_message: PropTypes.any,
      status: PropTypes.string,
      topic: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        logo: PropTypes.string
      }),
      unread_messages_count: PropTypes.number
    })
  }),
  avatar: PropTypes.string
};

Message.defaultProps = { status: '' };

export default Message;
