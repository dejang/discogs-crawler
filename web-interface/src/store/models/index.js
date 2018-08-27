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
    closeDialog (state) {
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
    async loadRelease (payload) {
      const release = await fetch (
        `/releases/release?id=${payload.id}`
      ).then (resp => resp.json ());
      dispatch.dialog.updateRelease (release);
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
  }),
};

export const sidebar = {
  state: {
    open: false,
    form: {
      decade: '',
      year: '',
      style: 'Minimal',
      genre: 'Electronic',
      format: 'Vinyl',
      page: 1,
      searchString: '',
    },
    years: [],
    styles: [
      {key: 'Minimal', value: 'Minimal', text: 'Minimal'},
      {key: 'Techno', value: 'Techno', text: 'Techno'},
      {key: 'House', value: 'House', text: 'House'},
      {key: 'Tech House', value: 'Tech House', text: 'Tech House'},
    ],
    pages: [],
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

      const qString = keys.reduce (acc, '');
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
  },
  reducers: {
    login (state, payload) {
      return Object.assign ({}, state, {loggedIn: true});
    },
  },
};
