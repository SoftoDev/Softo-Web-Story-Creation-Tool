/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { render, useMemo } from '@web-stories-wp/react';
import StoryEditor from '@web-stories-wp/story-editor';
import styled from 'styled-components';

/**
 * Internal dependencies
 */

import registerServiceWorker from './serviceWorkerRegistration';
import Layout from './components/layout';
import { LOCAL_STORAGE_CONTENT_KEY } from './consts';
import MediaUpload from './components/MediaUpload';
import '../public/main.css';
import { MediaProvider, useMedia } from './app/media';
import { saveStoryById } from './api';

const AppContainer = styled.div`
  height: 100vh;
`;

function getInitialStory() {
  const savedStory = window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
  return savedStory ? JSON.parse(savedStory) : {};
}

const CoreEditor = () => {
  const {
    actions: { updateMediaCallback, getMediaCallback, deleteMedia },
  } = useMedia(({ state, actions }) => {
    return { state, actions };
  });
  const config = useMemo(() => {
    return {
      autoSaveInterval: 5,
      capabilities: {
        hasUploadMediaAction: true,
      },
      apiCallbacks: {
        saveStoryById,
        getMedia: getMediaCallback,
        updateMedia: updateMediaCallback,
        deleteMedia,
      },
      MediaUpload,
    };
  }, [updateMediaCallback, getMediaCallback, deleteMedia]);
  return (
    <StoryEditor config={config} initialEdits={{ story: getInitialStory() }}>
      <Layout />
    </StoryEditor>
  );
};

const Playground = () => {
  return (
    <AppContainer>
      <MediaProvider>
        <CoreEditor />
      </MediaProvider>
    </AppContainer>
  );
};

const initEditor = () => {};
render(<Playground />, document.getElementById('playground-root'));

if ('loading' === document.readyState) {
  registerServiceWorker();
  document.addEventListener('DOMContentLoaded', initEditor);
} else {
  initEditor();
}