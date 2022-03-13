import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, MessageTeam } from 'stream-chat-react';
import * as PropTypes from "prop-types";
import Cookies from 'universal-cookie';

import { ChannelContainer, ChannelListContainer, Auth } from './components';

import 'stream-chat-react/dist/css/index.css';
import './App.css';

const cookies = new Cookies();

const apiKey = 'rpbqpzyqz8mv';
const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

async function getStandardChannels(userID) {
  const filter1 = {type : "team", id: { $in: ['Organisations'] }};
  const filter2 = {type : "team", id: { $in: ['Listings'] }};
  const filter3 = {type : "team", id: { $in: ['Mentors'] }};
  const channels1 = await client.queryChannels(filter1);
  const channels2 = await client.queryChannels(filter2);
  const channels3 = await client.queryChannels(filter3);
  const channels = [channels1, channels2, channels3];
  for (let channel of channels) {
    channel[0].addMembers([String(userID)])
  }
};

if(authToken) {
  client.connectUser({
      id: cookies.get('userId'),
      name: cookies.get('username'),
      displayName: cookies.get('displayName'),
      hashedPassword: cookies.get('hashedPassword'),
      image: '',
  }, authToken);
  getStandardChannels(cookies.get('userId'));
}

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if(!authToken) return <Auth />

  return (
    <div className='app__wrapper'>
        <Chat client={client} theme="team light">
          <ChannelListContainer
            // props
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
          />
          <ChannelContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            createType={createType}
          />
          </Chat>
    </div>
  );
}

export default App;