const EventActions = ({ event }) => {
  return (
    <div className="event-actions mt-4 flex space-x-4">
      <button className="like-button text-green-500">👍 {event.likes}</button>
      <button className="dislike-button text-red-500">👎 {event.dislikes}</button>
    </div>
  );
};

export default EventActions;