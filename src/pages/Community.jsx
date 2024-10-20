import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Camera, Video, Users, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import axios from 'axios';



const dummyChats = [
  { id: 1, text: "Hello everyone!", user: "john_doe", timestamp: "2023-10-20T10:30:00" },
  { id: 2, text: "Hi John! How are you?", user: "jane_smith", timestamp: "2023-10-20T10:31:00" },
];



const Community = () => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState(dummyChats);
  const [newMessage, setNewMessage] = useState('');
  const [guides, setGuides] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchData = useCallback(async () => {
    try {
    
     const response = await axios.get('/users');
        const members = response.data;
        setMembers(members);
        
        const responseEvents = await axios.get('/events');
        const events = responseEvents.data;
        setEvents(events);
      

      // user from local storage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

    } catch (error) {
      console.error('Error in fetchData:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollow = async (userId) => {
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    const updatedMembers = members.map(member => 
      member.id === userId ? { ...member, isFollowed: !member.isFollowed } : member
    );
    setMembers(updatedMembers);
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
    }
  };

  const handleReaction = async (eventId, reactionType) => {
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    setEvents(events.map(event => 
      event.id === eventId ? { ...event, userReaction: reactionType } : event
    ));
  };

  const startVideoCall = () => {
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