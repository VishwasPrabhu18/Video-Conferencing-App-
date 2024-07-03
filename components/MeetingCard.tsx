"use client";

import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { avatarImages } from '@/constants'

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  link: string;
  handleClick: () => void;
};

const MeetingCard = ({icon, title, date, isPreviousMeeting, buttonIcon1, handleClick, link, buttonText}: MeetingCardProps) => {
  return (
    <section className='flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]'>
      <article className='flex flex-col gap-5'>
        <Image
          src={icon}
          alt='Upcoming'
          width={28}
          height={28}
        />

        <div className='flex justify-between'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>{title}</h1>
            <p className='text-base font-normal'>{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-evenly relative", {})}>
        <div className='relative flex w-full max-sm:hidden'>
          {
            avatarImages.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt='Attendees'
                width={40}
                height={40}
                className={cn("rounded-full", {
                  "absolute": idx > 0
                })}
                style={{ top: 0, left: idx * 28 }}
              />
            ))
          }

          <div className='flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4'>+5</div>
        </div>

        {
          !isPreviousMeeting && (
            <div className='flex gap-2'>
              <Button
                className='rounded bg-blue-1 px-6'
                onClick={handleClick}>
                {
                  buttonIcon1 && (
                    <Image
                      src={buttonIcon1}
                      alt="Feature"
                      width={20}
                      height={20}
                    />
                  )
                }
                &nbsp; {buttonText}
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast({
                    title: "Link copied",
                  });
                }}
                className='bg-dark-4 px-6'
              >
                <Image
                  src="/icons/copy.svg"
                  alt="Feature Copy"
                  width={20}
                  height={20}
                />
                &nbsp; Copy Link
              </Button>
            </div>
          )
        }
      </article>
    </section>
  )
}

export default MeetingCard