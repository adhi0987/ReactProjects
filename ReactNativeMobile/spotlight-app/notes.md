# ScrollView vs FlatList

## Use FlastList When:
- performance is critical:FlatList only renders items currently visible on screen ,saving memory and improving perfoemance.
- Long lists of data: when rendering potentially  large sets of data .
- Unknpwn content length: When you dont know how many you ll need to display
- Same Kind of content: When Displaying  many items with the same structure.

## Use ScrollView When:
-  All contents fit in memory: When you re displaying a small fixed amount of content that wont cause performance issues.
- Static content: For screens with predetermined limited content like forms ,profile pages , datail view
- Mixed content types: when you need to display UI components in a specific  layout that doesnt follow a list pattern
- Horizantal carousel-like elements: Small  horizantal scrolling components like image carousels with limited items

# Pressable vs TouchableOpacity

## Use Pressable When:
- More customizable is needed: Pressable offers more customisable option s for different states(pressed, hovered ,focused).
- Complex integration states:When you need to handle  multiple interaction state with fine-graded control.
- Future-profing: Pressable is newer  and designed to eventually replace the Touchable components.
- Platform-specific behaviour: When you went to customize behavior across different  platform.
- Nested presshandlers: When you need to handle nested interactive elements

## Use TouchableOpacity When: 
- Simple FadeEffect: When you just need a simple opacity change on press.
- Backwards compatibility: When working with older codebases that already use Touchable Opacity.
- Simpler API: when you prefer a more straightforward  API with fewer options to configure
- Specific opacity animations: When you need a precise control over the opacity values on press.
- Legacy support for maintaining consistency with existing components.

# Building and Publilshing
- build app for production with ExpoApplication Services

# steps
 - visiti expo.dev and signuo
 - npm i -g eas-cli
 - eas login
 - eas init
 - eas build --platform android

## Note: 
- double exclamation converts the js object into boolean