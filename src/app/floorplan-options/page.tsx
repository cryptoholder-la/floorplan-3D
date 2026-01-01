import React from 'react';
import FloorplanApp from '../../components/FloorplanApp';
import '../../components/floorplan-options.css';

export default function FloorplanOptionsPage() {
  return (
    <FloorplanApp
      title="Floorplan Options"
      subtitle="Professional CAD Design System with Multiple UI Interfaces"
      showNavigation={true}
      showUserMenu={true}
    />
  );
}
