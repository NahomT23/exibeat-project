'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaPlay } from 'react-icons/fa';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { 
  getAllTracks, 
  getMessages, 
  sendFeedback, 
  markAsRead 
} from '@/lib/api';
import { TrackData, MessageData } from '@/lib/types';
import { formatDate } from '@/lib/dateFormat';

const Dj = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messageDate, setMessageDate] = useState<string | null>(null);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasSentFeedback, setHasSentFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllTracks();
        setTracks(data.map((track: any) => ({
          id: track._id,
          title: track.trackTitle,
          artist: track.artist || "Unknown Artist",
          progress: track.progress || 45,
          tags: track.tags || [],
          hasUnreadMessage: track.hasUnreadMessage,
          hasFeedback: track.hasFeedback || false
        })));
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracks();
    const interval = setInterval(fetchTracks, 30000);
    return () => clearInterval(interval);
  }, []);

  const openFeedback = async (id: string) => {
    setSelectedTrackId(id);
    setFeedbackContent('');
    setHasSentFeedback(false);
    setMessageDate(null);
    
    try {
      await markAsRead(id);
      setTracks(prev =>
        prev.map(track =>
          track.id === id ? { ...track, hasUnreadMessage: false } : track
        )
      );

      const messagesData = await getMessages(id);
      const formattedMessages = messagesData.map((msg: any) => ({
        sender:
          msg.senderId === process.env.NEXT_PUBLIC_PRODUCER_ID
            ? "Producer"
            : "DJ",
        time: formatDate(msg.timestamp),
        message: msg.content,
        track: tracks.find(t => t.id === id)?.title || "",
        isDJ: msg.senderId === process.env.NEXT_PUBLIC_DJ_ID
      }));

      // If there is at least one message, extract its date; otherwise, use today
      if (messagesData.length > 0 && messagesData[0].timestamp) {
        const firstTimestamp = new Date(messagesData[0].timestamp);
        const formattedDate = firstTimestamp.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
        });
        setMessageDate(formattedDate);
      } else {
        const today = new Date();
        const formattedToday = today.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
        });
        setMessageDate(formattedToday);
      }

      const djSent = formattedMessages.some((msg: { isDJ: any }) => msg.isDJ);
      setHasSentFeedback(djSent);

      setMessages(formattedMessages);
      setOpenDialog(true);
    } catch (error) {
      console.error('Failed to open feedback:', error);
      alert('Failed to load messages. Please try again.');
    }
  };

  const handleSendFeedback = async () => {
    if (!selectedTrackId) return;

    if (hasSentFeedback) {
      alert("You can only send one feedback per track");
      return;
    }

    if (!feedbackContent.trim()) {
      alert("Please enter feedback message");
      return;
    }

    setIsSending(true);
    try {
      await sendFeedback(selectedTrackId, feedbackContent);

      const newMessage: MessageData = {
        sender: "DJ",
        time: formatDate(new Date()),
        message: feedbackContent,
        track: tracks.find(t => t.id === selectedTrackId)?.title || "",
        isDJ: true
      };
      setMessages(prev => [...prev, newMessage]);
      setHasSentFeedback(true);
      setFeedbackContent('');

      setTracks(prev =>
        prev.map(track =>
          track.id === selectedTrackId ? { ...track, hasFeedback: true } : track
        )
      );
    } catch (error) {
      console.error("Failed to send feedback:", error);
      alert('Failed to send feedback. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading tracks...</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">No tracks submitted yet</p>
      </div>
    );
  }

  const currentTrack = tracks.find(t => t.id === selectedTrackId);

  return (
    <div className="mt-10 mx-4 md:mx-20 space-y-8">

      {/* DUMMY TRACK */}
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex items-center md:mr-10 mb-4 md:mb-0 md:min-w-[250px]">
          <FaPlay className="mr-3" />
          <div className="w-10 h-10 bg-gray-300 rounded mr-4"></div>
          <div>
            <p className="text-sm hkg-bold text-black">
              Quantum Drift <span className='text-xs font-light'>(dummy data)</span>
            </p>
            <p className="text-xs hkg-bold text-gray-600">Pens</p>
          </div>
        </div>

        {/* DUMMY DATA */}
        <div className="flex flex-col w-full max-w-[32rem]">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2 w-full">
            <div
              className="h-full bg-blue-600"
              style={{ width: `45%` }} 
            ></div>
          </div>
          <div className="flex flex-wrap gap-2 text-blue-600 mb-1">
            <p className="text-xs px-2 py-1 rounded-full border border-gray-400">BASS, EDM</p>
            <p className="text-xs px-2 py-1 rounded-full border border-gray-400">130</p>
            <p className="text-xs px-2 py-1 rounded-full border border-gray-400">Dark, Groovy</p>
          </div>
        </div>

        <div className="text-right mt-2 md:mt-0 md:ml-auto md:mr-20">
          {/* No feedback link for dummy */}
        </div>
      </div>

      {/* REAL TRACKS */}
      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex flex-col md:flex-row md:items-center mb-8"
        >
          <div className="flex items-center md:mr-10 mb-4 md:mb-0 md:min-w-[250px]">
            <FaPlay className="mr-3" />
            <div className="w-10 h-10 bg-gray-300 rounded mr-4"></div>
            <div>
              <p className="text-sm hkg-bold text-black">{track.title}</p>
              <p className="text-xs hkg-regular text-gray-600">{track.artist}</p>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="flex flex-col w-full max-w-[32rem]">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2 w-full">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${track.progress}%` }}
              ></div>
            </div>
            <div className="flex flex-wrap gap-2 text-blue-600">
              {track.tags.map((tag, index) => (
                <p
                  key={index}
                  className="text-xs px-2 py-1 rounded-full border border-blue-600"
                >
                  {tag}
                </p>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="text-right mt-2 md:mt-0 md:ml-auto md:mr-20">
            <p
              className="text-sm hkg-regular underline cursor-pointer"
              onClick={() => openFeedback(track.id)}
            >
              Send Feedback
            </p>
            {track.hasUnreadMessage && (
              <p className="text-xs hkg-light">1 unread message</p>
            )}
          </div>
        </div>
      ))}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold mt-3">
              SEND FEEDBACK
            </DialogTitle>
          </DialogHeader>

          <hr />

          {/* Producer header on the left, inside horizontal lines */}
          <div className="flex items-center px-4 ">
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
            <p className="text-base font-medium text-gray-800">Producer:</p>
          </div>
          <hr />

          {/* Day (from first message or today) */}
          {messageDate && (
            <p className="text-center text-xs text-gray-500 mb-2">
              {messageDate}
            </p>
          )}

          {/* Messages area */}
          <div className="px-4 space-y-4 max-h-[300px] overflow-y-auto py-2">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.isDJ ? "flex justify-end" : ""}
                >
                  <div
                    className={`p-2 rounded max-w-[70%] text-sm ${
                      msg.isDJ ? "bg-blue-200" : "bg-gray-100"
                    }`}
                  >
                    {msg.message && <p>{msg.message}</p>}
                    {!msg.isDJ && (
                      <div className="flex items-center bg-white rounded px-2 py-1 mt-2 w-fit shadow-sm">
                        <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                        <p className="text-xs text-gray-800">{msg.track}</p>
                      </div>
                    )}
                    {msg.isDJ && (
                      <div className="flex items-center justify-end mt-1 text-[10px] text-gray-500">
                        {msg.time.split(', ')[1]}
                        <IoCheckmarkDoneOutline className="ml-1 text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              currentTrack && (
                <div className="flex">
                  <div className="p-2 rounded max-w-[70%] text-sm bg-gray-100">
                    <div className="flex items-center bg-white rounded px-2 py-1 mt-2 w-fit shadow-sm">
                      <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                      <p className="text-xs text-gray-800">{currentTrack.title}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <hr className="mt-2" />
          <div className="flex flex-col sm:flex-row items-center px-4 py-2 space-y-2 sm:space-y-0">
            <input
              type="text"
              placeholder="Type your message..."
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-100 text-sm focus:outline-none"
              disabled={hasSentFeedback}
            />
            <button
              className={`px-4 py-2 text-sm rounded ${
                hasSentFeedback
                  ? "bg-blue-400 cursor-not-allowed hkg-regular w-full sm:w-auto text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white hkg-regular w-full sm:w-auto"
              }`}
              onClick={handleSendFeedback}
              disabled={isSending || hasSentFeedback || !feedbackContent.trim()}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dj;
