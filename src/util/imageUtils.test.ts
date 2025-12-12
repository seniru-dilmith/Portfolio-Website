
import { compressAndConvertToJpg } from './imageUtils';
import imageCompression from 'browser-image-compression';

// Mock the browser-image-compression library
jest.mock('browser-image-compression', () => {
    return jest.fn(() => {
        // Return a dummy blob imitating a compressed file
        return Promise.resolve(new Blob(['compressed-content'], { type: 'image/jpeg' }));
    });
});

describe('imageUtils', () => {
    describe('compressAndConvertToJpg', () => {
        it('should call imageCompression with correct options', async () => {
            const file = new File(['dummy-content'], 'test-image.png', { type: 'image/png' });
            
            await compressAndConvertToJpg(file);

            expect(imageCompression).toHaveBeenCalledWith(
                file,
                expect.objectContaining({
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/jpeg',
                })
            );
        });

        it('should return a File with .jpg extension and image/jpeg type', async () => {
            const file = new File(['dummy-content'], 'my-photo.png', { type: 'image/png' });
            
            const result = await compressAndConvertToJpg(file);

            expect(result).toBeInstanceOf(File);
            expect(result.name).toBe('my-photo.jpg');
            expect(result.type).toBe('image/jpeg');
        });

        it('should handle files already having .jpg extension correctly', async () => {
             const file = new File(['dummy-content'], 'already-jpg.jpg', { type: 'image/jpeg' });
            
            const result = await compressAndConvertToJpg(file);

            expect(result.name).toBe('already-jpg.jpg');
            expect(result.type).toBe('image/jpeg');
        });

         it('should throw error if compression fails', async () => {
            (imageCompression as unknown as jest.Mock).mockRejectedValueOnce(new Error('Compression failed'));
            const file = new File(['dummy'], 'fail.png', { type: 'image/png' });

            await expect(compressAndConvertToJpg(file)).rejects.toThrow('Compression failed');
        });
    });
});
