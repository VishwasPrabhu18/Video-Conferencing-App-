// @ts-nocheck

"use client";

import React, { useEffect, useState } from 'react'
import { useGetCalls } from '@/hooks/useGetCalls'
import { useRouter } from 'next/navigation';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import MeetingCard from './MeetingCard';
import { Loader } from 'lucide-react';
import { toast } from './ui/use-toast';

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {

  const router = useRouter();

  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls(type)

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case "ended": return endedCalls;
      case "upcoming": return upcomingCalls;
      case "recordings": return recordings;
      default: return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended": return "No Previous Calls";
      case "upcoming": return "No Upcoming Calls";
      case "recordings": return "No Recordings";
      default: return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()));
  
        const recordings = callData
          .filter(call => call.recordings.length > 0)
          .flatMap(call => call.recordings);
        
        setRecordings(recordings);
      } catch (err) {
        console.log(err);
        toast({ title: "Try Again Later" });
      }
    }

    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
      {
        calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={type === "ended" ? "/icons/previous.svg" : type === "upcoming" ? "/icons/upcoming.svg" : "/icons/recordings.svg"}
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              'Personal Meeting'
            }
            date={meeting.state?.startsAt?.toLocaleString() || meeting.start_time.toLocaleString()}
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : " Start"}
            link={type === "recordings" ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
            handleClick={type === "recordings" ? () => router.push(`${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)}
          />
        )) : (
          <h1>{noCallsMessage}</h1>
        )
      }
    </div>
  )
}

export default CallList