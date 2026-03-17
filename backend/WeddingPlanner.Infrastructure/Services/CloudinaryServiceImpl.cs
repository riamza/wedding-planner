using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using WeddingPlanner.Application.Interfaces;

namespace WeddingPlanner.Infrastructure.Services;

public class CloudinaryServiceImpl : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }

    public async Task<(string Url, string PublicId)> UploadImageAsync(Stream fileStream, string fileName, string folder)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = folder,
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
        {
            throw new Exception($"Cloudinary upload failed: {result.Error.Message}");
        }

        return (result.SecureUrl.ToString(), result.PublicId);
    }

    public async Task DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}
