import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Camera, Video, Users, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {Link} from 'react-router-dom';

const Community = () => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [guides, setGuides] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [eventsResponse, usersResponse] = await Promise.all([
        fetch('/events'),
        fetch('/users')
      ]);

      if (!eventsResponse.ok || !usersResponse.ok) {
        throw new Error('One or more API requests failed');
      }

      const [eventsData, usersData] = await Promise.all([
        eventsResponse.json(),
        usersResponse.json()
      ]);

      setEvents(eventsData);
      setMembers(usersData);

      //chat messages from local storage (tutaweka db in fututure)
      const storedChats = localStorage.getItem('chats');
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }

      // user from local storage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      
      

      // following status
      const storedFollowing = localStorage.getItem('following');
      if (storedFollowing) {
        const followingSet = new Set(JSON.parse(storedFollowing));
        setMembers(usersData.map(user => ({
          ...user,
          isFollowed: followingSet.has(user.id)
        })));
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // chats to local 
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const handleFollow = async (userId) => {
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    try {
      const response = await fetch('/networking_connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id_1: currentUser.id,
          user_id_2: userId,
          event_id: null,
          connection_status: 'pending'
        }),
      });
      if (response.ok) {
        
        const updatedMembers = members.map(member => 
          member.id === userId ? { ...member, isFollowed: !member.isFollowed } : member
        );
        setMembers(updatedMembers);

        // updade thee local storage
        const following = updatedMembers
          .filter(member => member.isFollowed)
          .map(member => member.id);
        localStorage.setItem('following', JSON.stringify(following));
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const newChat = { 
        id: Date.now(), 
        text: newMessage, 
        user: currentUser.username,
        timestamp: new Date().toISOString()
      };
      setChats(prevChats => [...prevChats, newChat]);
      setNewMessage('');
      //  send the message to your backend API (tutaweka db in fututure)
    }
  };

  const handleReaction = async (eventId, reactionType) => {
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    try {
      const response = await fetch(`/event_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: currentUser.id,
          rating: reactionType === 'like' ? 5 : 1,
          comment: reactionType === 'like' ? 'Liked' : 'Disliked'
        }),
      });
      if (response.ok) {
        setEvents(events.map(event => 
          event.id === eventId ? { ...event, userReaction: reactionType } : event
        ));
      }
    } catch (error) {
      console.error('Error reacting to event:', error);
    }
  };

  const startVideoCall = () => {
    // video call functionality future too
    console.log('Starting video call...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">MingleSphere 🎉</CardTitle>
              <p className="text-sm text-gray-500">Private group · {members.length} members</p>
            </div>
            <Button>Invite</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-20">
            <div className="flex space-x-2">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <Avatar className="mb-1">
                    <AvatarImage src={member.profile_photo_url} alt={member.username} />
                    <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {currentUser && currentUser.id !== member.id && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFollow(member.id)}
                    >
                      {member.isFollowed ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <Tabs defaultValue="chats" className="mt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>
            <TabsContent value="chats">
              <ScrollArea className="h-[300px] mb-4">
                {chats.map((chat) => (
                  <div key={chat.id} className="mb-2">
                    <strong>{chat.user}:</strong> {chat.text}
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(chat.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Write something..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm"><Camera className="w-4 h-4 mr-2" /> Photo</Button>
                <Button variant="outline" size="sm" onClick={startVideoCall}><Video className="w-4 h-4 mr-2" /> Room</Button>
                <Button variant="outline" size="sm"><Users className="w-4 h-4 mr-2" /> Event</Button>
              </div>
            </TabsContent>
            <TabsContent value="events">
              <h3 className="font-semibold mb-2">Upcoming Events</h3>
              <ScrollArea className="h-[300px]">
                {events.map((event) => (
                  <Card key={event.id} className="mb-4">
                    <CardHeader>
                    <Link to={`/event/${event.id}`}>  <CardTitle>{event.title}</CardTitle> </Link>
                      <Badge>{new Date(event.start_datetime).toLocaleDateString()}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p>{event.description}</p>
                      <div className="flex justify-between mt-2">
                        <Button onClick={() => handleReaction(event.id, 'like')} variant={event.userReaction === 'like' ? 'default' : 'outline'}>
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Like
                        </Button>
                        <Button onClick={() => handleReaction(event.id, 'dislike')} variant={event.userReaction === 'dislike' ? 'default' : 'outline'}>
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Dislike
                        </Button>
                        <Button variant="outline">
                          <Heart className="w-4 h-4 mr-2" />
                          Interested
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="guides">
              <h3 className="font-semibold mb-2">Community Guides</h3>
              <ScrollArea className="h-[300px]">
                {guides.map((guide) => (
                  <Card key={guide.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{guide.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{guide.description}</p>
                      <Button variant="link">Read More</Button>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="topics">
              <h3 className="font-semibold mb-2">Popular Topics</h3>
              <ScrollArea className="h-[300px]">
                {topics.map((topic) => (
                  <Card key={topic.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{topic.description}</p>
                      <Button variant="link">Join Discussion</Button>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;