'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sendTrack } from '@/lib/api';

const Producer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [editingTrack, setEditingTrack] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMessage = () => {
    setIsDialogOpen(false);
  };

  const handleSubmitTracks = async () => {
    if (!trackName.trim()) return;
    
    setIsLoading(true);
    try {
      await sendTrack({
        trackTitle: trackName,
        initialMessage: message
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit track. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = () => {
    if (trackName.trim() !== '') {
      setEditingTrack(false);
    }
  };

  const resetTrack = () => {
    setTrackName('');
    setEditingTrack(true);
  };

  return (
    <div className="flex justify-center items-center mt-5">
      <div className="w-96 p-6 bg-white border border-dashed border-black rounded-lg">
        <h2 className="text-center text-lg font-bold mb-4">
          {isSubmitted ? 'Tracks Sent' : 'Submit Tracks'}
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          MP3, WAVE up to 60 MB. 1 track max
        </p>

        <div className="mb-6">
          <hr className="border-dashed border-t border-black mb-2" />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 mr-4"></div>
              {editingTrack ? (
                <input
                  type="text"
                  autoFocus
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  onBlur={handleBlur}
                  className="text-sm font-medium text-gray-800 border-b border-gray-400 outline-none"
                  placeholder="Enter track"
                />
              ) : (
                <span className="text-sm font-medium text-gray-800">
                  {trackName}
                </span>
              )}
            </div>

            {!editingTrack && (
              <span
                className="text-sm font-medium text-gray-800 cursor-pointer"
                onClick={resetTrack}
              >
                X
              </span>
            )}
          </div>

          <hr className="border-dashed border-t border-black mt-2" />
        </div>

        {message && (
          <p className="text-sm text-gray-800 mb-6">
            {message}
          </p>
        )}

        {!isSubmitted && (
          <p
            className="text-sm text-gray-600 mb-6 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <u>{message ? 'Edit message' : 'Add message'}</u>
          </p>
        )}

        {!isSubmitted && (
          <div className='flex items-center justify-center'>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmitTracks}
              disabled={isLoading || !trackName.trim()}
            >
              {isLoading ? 'Submitting...' : 'Submit Tracks'}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-4xl text-center w-full">
                ADD MESSAGE
              </DialogTitle>
            </div>
          </DialogHeader>

          <label className="block text-sm font-medium text-gray-700 -mb-3">
            Message
          </label>

          <Textarea
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="resize-none focus:outline-none focus:border-blue-500"
          />

          <DialogFooter className='mt-2'>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleAddMessage}
            >
              ADD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Producer;