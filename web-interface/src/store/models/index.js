import mockReleases from '../mock-releases';

export const releases = {
  state: [],
  reducers: {
    // handle state changes with pure functions
    updateReleases (state, payload) {
      return payload;
    },
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync (payload, rootState) {
      await new Promise (resolve => setTimeout (resolve, 1000));
      dispatch.count.increment (payload);
    },
  }),
};

export const dialog = {
  state: {
    open: false,
    release: {tracklist: []},
    currentIndex: 0,
    videoId: '',
  },
  reducers: {
    openState (state) {
      return Object.assign ({}, state, {open: true});
    },
    close (state) {
      return Object.assign ({}, state, {
        open: false,
        videoId: '',
        currentIndex: 0,
      });
    },
    updateRelease (state, payload) {
      return Object.assign ({}, state, {release: payload});
    },
    viewVideo (state, payload) {
      const videoId = state.release.tracklist[payload].youtube.split ('v=')[1];
      return Object.assign ({}, state, {videoId, currentIndex: payload});
    },
    next (state) {
      if (state.currentIndex === state.release.tracklist.length) {
        return state;
      }
      return Object.assign ({}, state, {currentIndex: ++state.currentIndex});
    },
    prev (state) {
      if (state.currentIndex === 0) {
        return state;
      }
      return Object.assign ({}, state, {currentIndex: --state.currentIndex});
    },
    playCurrent (state) {
      const {currentIndex, release} = state;
      const videoId = release.tracklist[currentIndex].youtube.split ('v=')[1];
      return Object.assign ({}, state, {videoId});
    },
  },
  effects: dispatch => ({
    async loadRelease (payload, state) {
      const release = await fetch (
        `/releases/release?id=${payload.id}&token=${state.user.token}&discogsToken=${state.user.discogsToken}`
      ).then (resp => resp.json ());
      dispatch.dialog.updateRelease (release);
      fetch (`/`);
    },
    async openDialog (payload) {
      await dispatch.dialog.loadRelease ({id: payload.id});
      dispatch.dialog.openState ();
      dispatch.dialog.viewVideo (0);
    },
    nextTrack () {
      dispatch.dialog.next ();
      dispatch.dialog.playCurrent ();
    },
    prevTrack () {
      dispatch.dialog.prev ();
      dispatch.dialog.playCurrent ();
    },
    async closeDialog () {
      dispatch.dialog.close ();
      await dispatch.sidebar.submit ();
    },
  }),
};

const defaultSearch = {
  decade: '2010',
  year: '2018',
  style: 'Minimal',
  genre: 'Electronic',
  format: 'Vinyl',
  page: 1,
  searchString: '',
};

export const sidebar = {
  state: {
    open: false,
    form: defaultSearch,
    years: [],
    styles: [
      {key: 'Minimal', value: 'Minimal', text: 'Minimal'},
      {key: 'Techno', value: 'Techno', text: 'Techno'},
      {key: 'House', value: 'House', text: 'House'},
      {key: 'Tech House', value: 'Tech House', text: 'Tech House'},
    ],
    pages: [],
    format: [
      {key: 'Vinyl', text: 'Vinyl', value: 'Vinyl'},
      {key: 'File', text: 'File', value: 'File'},
    ],
  },
  reducers: {
    changeValue (state, payload) {
      const form = Object.assign ({}, state.form, {
        [payload.key]: payload.value,
      });
      return Object.assign ({}, state, {form});
    },
    changeYears (state, payload) {
      return Object.assign ({}, state, {years: payload});
    },
    toggle (state, payload) {
      return Object.assign ({}, state, {open: !state.open});
    },
    updatePages (state, pagination) {
      const out = [];
      for (let i = 1; i <= pagination.pages; i++) {
        out.push ({key: i, value: i, text: i});
      }
      const form = Object.assign ({}, state.form, {page: pagination.page});
      return Object.assign ({}, state, {pages: out, form});
    },
    clear (state) {
      return Object.assign ({}, state, {
        form: {
          decade: '',
          year: '',
          style: '',
          genre: 'Electronic',
          format: '',
          page: 1,
          searchString: '',
        },
      });
    },
  },
  effects: dispatch => ({
    changeDecade (payload, state) {
      dispatch.sidebar.changeValue (payload);

      const years = [];
      const decade = parseInt (payload.value);
      const endYear = decade + 10;
      for (let i = decade; i < endYear; i++) {
        years.push ({
          key: `${i}`,
          text: `${i}`,
          value: `${i}`,
        });
      }

      dispatch.sidebar.changeValue ({key: 'year', value: years[0].value});
      dispatch.sidebar.changeYears (years);
    },
    async submit (payload, state) {
      const form = state.sidebar.form;
      const keys = Object.keys (form);

      const acc = (acc, currentValue) =>
        `${acc}${currentValue}=${form[currentValue]}&`;

      let qString = keys.reduce (acc, '');
      qString += `token=${state.user.token}&discogsToken=${state.user.discogsToken}`;
      const releases = await fetch (`/releases/search?${qString}`).then (r =>
        r.json ()
      );
      dispatch.releases.updateReleases (releases.results);
      dispatch.sidebar.updatePages (releases.pagination);
    },

    async nextPage (payload, state) {
      let currentPage = state.sidebar.form.page;
      if (currentPage !== 0 && state.releases.length === 0) {
        return;
      }
      dispatch.sidebar.changeValue ({key: 'page', value: ++currentPage});
      dispatch.sidebar.submit ();
    },

    async prevPage (payload, state) {
      let currentPage = state.sidebar.form.page;
      if (currentPage === 0) {
        return;
      }
      dispatch.sidebar.changeValue ({key: 'page', value: --currentPage});
      dispatch.sidebar.submit ();
    },
  }),
};

export const user = {
  state: {
    loggedIn: false,
    credentials: {
      username: '',
      password: '',
    },
    users: {
      1: 'dejan',
      2: 'luis',
      3: 'zoli',
      4: 'fabrizio',
      5: 'nikita',
      6: 'teo',
      7: 'gabi',
    },
    token: undefined,
    discogsToken: '',
  },
  reducers: {
    typeKey (state, payload) {
      const credentials = Object.assign ({}, state.credentials, {
        [payload.key]: payload.value,
      });
      return Object.assign ({}, state, {credentials});
    },
    startSesstion (state, sId) {
      return Object.assign ({}, state, {loggedIn: true, token: sId});
    },
    updateDiscogsToken (state, payload) {
      return Object.assign ({}, state, {discogsToken: payload});
    },
  },
  effects: dispatch => ({
    async login (payload, state) {
      const {credentials} = state.user;
      if (credentials.username !== credentials.password) {
        return;
      }

      let passed = false;
      const sIds = Object.keys (state.user.users);
      sIds.forEach (k => {
        if (state.user.users[k] === credentials.username) {
          passed = true;
          dispatch.user.startSesstion (k);
          return;
        }
      });

      if (!passed) {
        return;
      }
      dispatch.sidebar.changeDecade ({key: 'decade', value: '2010'});
      dispatch.sidebar.changeValue ({key: 'year', value: '2018'});
      await dispatch.sidebar.submit ();
    },
  }),
};
