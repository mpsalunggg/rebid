import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/features/home/screens/HomeScreen';
// import { ItemsScreen } from '@/features/items/screens/ItemsScreen';
// import ProfileScreen, ...

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="MyItems" component={ItemsScreen} options={{ title: 'My Items' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
}