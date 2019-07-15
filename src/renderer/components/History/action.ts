import { PomodoroRecord } from '../../monitor';
import { createActionCreator, createReducer } from 'deox';
import { getAllSession } from '../../monitor/sessionManager';
import { Dispatch } from 'redux';

export interface HistoryState {
    records: PomodoroRecord[];
}

export const defaultState: HistoryState = {
    records: []
};

const fetchHistoryFromDisk = createActionCreator(
    '[History]FETCH_HISTORY_FROM_DISK',
    resolve => (records: PomodoroRecord[]) => resolve({ records })
);
const addRecordToHistory = createActionCreator(
    '[History]ADD_RECORD',
    resolve => (record: PomodoroRecord) => resolve(record)
);
const removeRecordFromHistory = createActionCreator(
    '[History]REMOVE_RECORD',
    resolve => (record: PomodoroRecord) => resolve(record)
);

export const actions = {
    addRecordToHistory,
    removeRecordFromHistory,
    fetchHistoryFromDisk: () => async (dispatch: Dispatch) => {
        const records = await getAllSession();
        dispatch(fetchHistoryFromDisk(records));
    }
};

export type HistoryActionCreatorTypes = { [key in keyof typeof actions]: typeof actions[key] };
export const reducer = createReducer<HistoryState, any>(defaultState, handle => [
    handle(fetchHistoryFromDisk, (state, { payload }) => {
        return payload;
    }),

    handle(addRecordToHistory, (state: HistoryState, { payload }) => {
        const newState: HistoryState = { records: state.records.concat(payload) };
        return newState;
    }),

    handle(removeRecordFromHistory, (state: HistoryState, { payload }) => {
        const newState: HistoryState = { records: state.records.concat() };
        let i;
        for (i = 0; i < state.records.length; i += 1) {
            if (state.records[i].projectId === payload.projectId) {
                newState.records.splice(i, 1);
                break;
            }
        }
        return newState;
    })
]);