/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import Observable from "@kuindji/observable"
import { useOn } from "../dist/index"

test('should subscribe using event name and listener', () => {
    const o = new Observable;

    const triggered = [];
    const listener1 = () => triggered.push(1);
    const listener2 = () => triggered.push(2);

    const { rerender } = renderHook(
        ({ o, eventName, listener }) => useOn(o, eventName, listener), 
        {
            initialProps: { 
                o, 
                eventName: "event", 
                listener: listener1
            }
        }
    );

    o.trigger("event");
  
    rerender({ 
        o, 
        eventName: "event", 
        listener: listener2
    });

    o.trigger("event");
  

    expect(triggered.length).toBe(2);
    expect(triggered[0]).toBe(1);
    expect(triggered[1]).toBe(2);
});


test('should subscribe using event map', () => {
    const o = new Observable;

    const triggered = [];
    const listener1 = () => triggered.push(1);
    const listener2 = () => triggered.push(2);
    const listener3 = () => triggered.push(3);

    const { rerender } = renderHook(
        ({ o, eventMap }) => useOn(o, eventMap), 
        {
            initialProps: { 
                o, 
                eventMap: {
                    event1: listener1,
                    event2: listener2
                }
            }
        }
    );

    o.trigger("event1");
    o.trigger("event2");
    o.trigger("event3");
    o.trigger("event4");
  
    rerender({ 
        o, 
        eventMap: {
            event1: listener1,
            event3: listener3
        }
    });

    o.trigger("event1");
    o.trigger("event2");
    o.trigger("event3");
    o.trigger("event4");
  

    expect(triggered.length).toBe(4);
    expect(triggered[0]).toBe(1);
    expect(triggered[1]).toBe(2);
    expect(triggered[2]).toBe(1);
    expect(triggered[3]).toBe(3);
});


test('should subscribe using event list', () => {
    const o = new Observable;

    const triggered = [];
    const listener1 = () => triggered.push(1);
    const listener2 = () => triggered.push(2);
    const listener3 = () => triggered.push(3);

    const { rerender } = renderHook(
        ({ o, eventList }) => useOn(o, eventList), 
        {
            initialProps: { 
                o, 
                eventList: [
                    { name: "event1", listener: listener1 },
                    { name: "event2", listener: listener2 }
                ]
            }
        }
    );

    o.trigger("event1");
    o.trigger("event2");
    o.trigger("event3");
    o.trigger("event4");
  
    rerender({ 
        o, 
        eventList: [
            { name: "event1", listener: listener1 },
            { name: "event3", listener: listener3 }
        ]
    });

    o.trigger("event1");
    o.trigger("event2");
    o.trigger("event3");
    o.trigger("event4");
  

    expect(triggered.length).toBe(4);
    expect(triggered[0]).toBe(1);
    expect(triggered[1]).toBe(2);
    expect(triggered[2]).toBe(1);
    expect(triggered[3]).toBe(3);
});