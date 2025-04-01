import type { Meta, StoryObj } from '@storybook/react';
import { fn } from "@storybook/test";
import PersonCard from '../components/PersonCard';

const meta = {
  component: PersonCard,
} satisfies Meta<typeof PersonCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userName: "John Doe",
    onClick: fn(),
  },
};