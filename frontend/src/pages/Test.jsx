import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getEvent } from '../features/events/eventSlice'
import { useDispatch } from 'react-redux'

export default function Test() {

    const { event } = useSelector((state) => state.events)

    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getEvent('638c5c70a4b38e96264451c0'))
    }, [dispatch])

  return (
    <div>{JSON.stringify(event)}</div>
  )
}
