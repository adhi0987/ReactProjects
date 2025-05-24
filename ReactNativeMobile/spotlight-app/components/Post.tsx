import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { styles } from "@/styles/feed.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import CommentsModal from "./CommentsModal";

type PostProps = {
  post: {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string | undefined;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      image: string;
    };
  };
};

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commnetsCount, setCommentsCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const toggleLike = useMutation(api.posts.toggleLike);

  useEffect(() => {
    console.log("[DEBUG] Post Loaded:", post);
  }, []);

  const handleLike = async () => {
    try {
      console.log("[DEBUG] Like button pressed. Current state:", {
        isLiked,
        likesCount,
      });

      const newIsLiked = await toggleLike({ postId: post._id });

      console.log("[DEBUG] toggleLike response:", newIsLiked);

      setIsLiked(newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      console.log("[DEBUG] Updated state:", {
        isLiked: newIsLiked,
        likesCount: newIsLiked ? likesCount + 1 : likesCount - 1,
      });
    } catch (error) {
      console.error("[ERROR] Error toggling like:", error);
    }
  };

  return (
    <View style={styles.post}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Link href="/(tabs)/notifications">
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>setShowComments(true)}>
            <Ionicons
              name={"chatbubble-outline"}
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name={"bookmark-outline"} size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCount > 0
            ? `${likesCount.toLocaleString()} likes`
            : "Be The First To Like"}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        <TouchableOpacity>
          <Text style={styles.commentText}> View all comments</Text>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>2 hours ago</Text>
      </View>
      <CommentsModal 
      postId={post._id}
      visible={showComments}
      onClose={()=>setShowComments(false)}
      onCommentAdded={()=> setCommentsCount((prev)=>prev+1)}
      />
    </View>
  );
}
