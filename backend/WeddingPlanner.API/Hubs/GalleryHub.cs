using Microsoft.AspNetCore.SignalR;

namespace WeddingPlanner.API.Hubs;

public class GalleryHub : Hub
{
    public async Task JoinEventGallery(string eventId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"gallery-{eventId}");
    }

    public async Task LeaveEventGallery(string eventId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"gallery-{eventId}");
    }
}
