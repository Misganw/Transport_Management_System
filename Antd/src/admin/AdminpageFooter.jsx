import React from "react";
import { Layout, Typography, Dropdown, Menu as AntMenu, Menu } from "antd";
const { Footer } = Layout;
const { Title, Text } = Typography;

function AdminpageFooter(props) {
  return (
    <>
      <Footer
        className={props.SidebarShow ? "admin-footer" : "collapsedFooter"}
      >
        <div className="footer-top">
          <div>© 2025 Company Inc.</div>
          <div>Made with ❤️ using Ant Design</div>
          <div>Contact: support@example.com</div>
        </div>
        <div className="footer-bottom">
          <Text type="secondary">
            This is a demo responsive admin dashboard layout.
          </Text>
        </div>
      </Footer>
    </>
  );
}

export default AdminpageFooter;
