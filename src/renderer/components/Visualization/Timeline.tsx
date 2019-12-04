import { Timeline } from 'antd';
import * as React from 'react';
import { PomodoroRecord } from '../../monitor/type';
import { getIndexToTitleApp } from '../../monitor/sessionManager';
import { EfficiencyAnalyser } from '../../../efficiency/efficiency';
import { to2digits } from '../../utils';

interface Props {
    record: PomodoroRecord;
    efficiencyAnalyser: EfficiencyAnalyser;
}

function formatTime(time: number) {
    const date = new Date(time);
    const hour = to2digits(date.getHours());
    const m = to2digits(date.getMinutes());
    const s = to2digits(date.getSeconds());
    return `${hour}:${m}:${s}.${date.getMilliseconds()}`;
}

export const PomodoroTimeline = (props: Props) => {
    const data: any[] = [];
    let time = props.record.startTime;
    const indexToTitle = getIndexToTitleApp(props.record);
    for (let i = 0; i < props.record.stayTimeInSecond!.length; i += 1) {
        const stay = props.record.stayTimeInSecond![i];
        const index = props.record.switchActivities![i];
        const [title, app] = indexToTitle[index];
        const isDistracting = props.efficiencyAnalyser.getIsDistracting(app, title);
        const sTime = formatTime(time);

        data.push(
            <Timeline.Item color={isDistracting ? 'red' : 'green'}>
                <p>{app}</p>
                <p>{title}</p>
                <p>{sTime}</p>
            </Timeline.Item>
        );

        time += stay;
    }

    return <Timeline>{data}</Timeline>;
};