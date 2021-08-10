import * as React from 'react';
import { useDispatch, useEpic } from 'react-epics';
import { IMessage } from '../../types';

const Message: React.FC = () => {
  const message = useEpic<IMessage>('message');
  const dispatch = useDispatch();

  return (
    <div className="message-wrapper">
      <h2>Dynamic message</h2>
      <h3>{message.value}</h3>
      <input
        value={message.value}
        type="text"
        onChange={e =>
          dispatch({
            type: 'message/updated',
            payload: {
              value: e.target.value,
            },
          })
        }
      />
    </div>
  );
};

export default Message;