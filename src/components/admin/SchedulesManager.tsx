import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { schedulesAPI } from "../../utils/api";
import { Checkbox } from "../ui/checkbox";

interface Schedule {
  id: number;
  day: string;
  subject: string;
  teacher: string;
  time: string;
  platform: string;
  link: string;
  isLive: boolean;
}

export function SchedulesManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    day: "",
    subject: "",
    teacher: "",
    time: "",
    platform: "",
    link: "",
    isLive: false,
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await schedulesAPI.getAll();
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSchedule ? "update" : "create";
      
      if (editingSchedule) {
        const response = await schedulesAPI.update(editingSchedule.id, formData);
        if (response.success) {
          toast.success("Schedule updated successfully");
        } else {
          toast.error(response.error || "Failed to update schedule");
        }
      } else {
        const response = await schedulesAPI.create(formData);
        if (response.success) {
          toast.success("Schedule created successfully");
        } else {
          toast.error(response.error || "Failed to create schedule");
        }
      }
      
      setDialogOpen(false);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const response = await schedulesAPI.delete(id);
      if (response.success) {
        toast.success("Schedule deleted successfully");
        fetchSchedules();
      } else {
        toast.error(response.error || "Failed to delete schedule");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete schedule");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      day: schedule.day,
      subject: schedule.subject,
      teacher: schedule.teacher,
      time: schedule.time,
      platform: schedule.platform,
      link: schedule.link,
      isLive: schedule.isLive,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      day: "",
      subject: "",
      teacher: "",
      time: "",
      platform: "",
      link: "",
      isLive: false,
    });
    setEditingSchedule(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#1A202C]">Class Schedules Management</h2>
          <p className="text-[#555555]">Manage weekly class schedules</p>
        </div>
        <Button
          onClick={handleOpenDialog}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <Card className="rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-[#555555] py-8">
                  No schedules found. Add your first schedule!
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.day}</TableCell>
                  <TableCell>{schedule.subject}</TableCell>
                  <TableCell>{schedule.teacher}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell>{schedule.platform}</TableCell>
                  <TableCell>
                    {schedule.isLive ? (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        LIVE
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        Scheduled
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
            </DialogTitle>
            <DialogDescription>
              Fill in the schedule details below
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day (বাংলা)</Label>
                <Input
                  id="day"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  placeholder="e.g., রবিবার, সোমবার"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., পদার্থ বিজ্ঞান"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher Name</Label>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="e.g., মো. করিম স্যার"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g., সকাল ১০:০০"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="e.g., YouTube, Zoom"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Class Link</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isLive"
                checked={formData.isLive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isLive: checked as boolean })
                }
              />
              <Label htmlFor="isLive" className="cursor-pointer">
                Mark as Live (LIVE badge will show)
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
              >
                {editingSchedule ? "Update Schedule" : "Create Schedule"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
